// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Messenger {
    // コントラクトの所有者アドレスを保存します。
    address public owner;

    // ユーザが保留できるメッセージ数の上限を設定します。
    uint256 public numOfPendingLimits;

    struct Message {
        uint256 depositInWei;
        uint256 timestamp;
        string text;
        bool isPending;
        address payable sender;
        address payable receiver;
    }

    // メッセージの受取人アドレスをkeyにメッセージを保存します。
    mapping(address => Message[]) messagesAtAddress;
    // ユーザが保留中のメッセージの数を保存します。
    mapping(address => uint256) numOfPendingAtAddress;

    event NewMessage(
        uint256 depositInWei,
        uint256 timestamp,
        string text,
        bool isPending,
        address sender,
        address receiver
    );

    event MessageAccepted(address receiver, uint256 index);
    event MessageDenied(address receiver, uint256 index);

    constructor(uint256 _numOfPendingLimits) {
        console.log("Here is my first smart contract!");

        // 所有者をデプロイしたアドレスに設定します。
        owner = msg.sender;

        numOfPendingLimits = _numOfPendingLimits;
    }

    function changeNumOfPendingLimits(uint256 _limit) external {
        require(msg.sender == owner, "sender must be owner");

        numOfPendingLimits = _limit;
    }

    // ユーザからメッセージを受け取り, 状態変数に格納します。
    function post(string memory _text, address payable _receiver)
        public
        payable
    {
        // メッセージ受取人の保留できるメッセージが上限に達しているかを確認します。
        require(
            messagesAtAddress[_receiver].length < numOfPendingLimits,
            "The receiver has reached the number of pending limits"
        );

        messagesAtAddress[_receiver].push(
            Message(
                msg.value,
                block.timestamp,
                _text,
                true,
                payable(msg.sender),
                _receiver
            )
        );

        emit NewMessage(
            msg.value,
            block.timestamp,
            _text,
            true,
            msg.sender,
            _receiver
        );
    }

    // メッセージ受け取りを承諾して, AVAXを受け取ります。
    function accept(uint256 _index) public {
        Message storage message = sefeAccessToMessage(msg.sender, _index);

        // 署名者アドレスとメッセージの受取人アドレスが同じか確認します。
        require(
            msg.sender == message.receiver,
            "The caller of the contract must be equal to the receiver of the message."
        );

        // メッセージの受取人にavaxを送信します。
        sendAvax(message.receiver, message.depositInWei);

        // メッセージの保留状態を解除します。
        message.isPending = false;

        // eventを投げます。
        emit MessageAccepted(message.receiver, _index);
    }

    // メッセージ受け取りを却下して, AVAXをメッセージ送信者へ返却します。
    function deny(uint256 _index) public payable {
        Message storage message = sefeAccessToMessage(msg.sender, _index);

        require(
            msg.sender == message.receiver,
            "The caller of the contract must be equal to the receiver of the message."
        );

        // メッセージの送信者にavaxを返却します。
        sendAvax(message.sender, message.depositInWei);

        message.isPending = false;

        emit MessageDenied(message.receiver, _index);
    }

    function sendAvax(address payable _to, uint256 _amountInWei) private {
        (bool success, ) = (_to).call{value: _amountInWei}("");
        require(success, "Failed to withdraw AVAX from contract.");
    }

    // indexをチェックした上でMessage[]にアクセスします。
    function sefeAccessToMessage(address _receiver, uint256 _index)
        private
        view
        returns (Message storage)
    {
        // 指定インデックスが配列の範囲を超えていないか確認します。
        require(
            _index < messagesAtAddress[_receiver].length,
            "Index is out of range"
        );

        return messagesAtAddress[_receiver][_index];
    }

    function getOwnMessages() public view returns (Message[] memory) {
        return messagesAtAddress[msg.sender];
    }
}
