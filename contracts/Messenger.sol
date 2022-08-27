// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./Ownable.sol";

contract Messenger is Ownable {
    // ユーザが保留できるメッセージ数の上限を設定します。
    uint256 public numOfPendingLimits;

    struct Message {
        uint256 deposit;
        uint256 timestamp;
        string text;
        bool isPending;
        address payable sender;
        address payable receiver;
    }

    // メッセージの受取人アドレスをkeyにメッセージを保存します。
    mapping(address => Message[]) private messagesAtAddress;
    // ユーザが保留中のメッセージの数を保存します。
    mapping(address => uint256) private numOfPendingAtAddress;

    event NewMessage(
        uint256 deposit,
        uint256 timestamp,
        string text,
        bool isPending,
        address sender,
        address receiver
    );

    event MessageConfirmed(address receiver, uint256 index);

    constructor(uint256 _numOfPendingLimits) payable {
        console.log("Here is my first smart contract!");

        // 所有者をデプロイしたアドレスに設定します。
        owner = msg.sender;

        numOfPendingLimits = _numOfPendingLimits;
    }

    // ownerのみこの関数を実行できるように修飾子を利用します。
    function changeNumOfPendingLimits(uint256 _limit) external onlyOwner {
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

        // 関数を呼び出したアドレスとメッセージの受取人アドレスが同じか確認します。
        require(
            msg.sender == message.receiver,
            "The caller of the contract must be equal to the receiver of the message"
        );

        // メッセージが保留中か確認します。
        require(
            message.isPending == true,
            "This message has already been confirmed"
        );

        // メッセージの受取人にavaxを送信します。
        sendAvax(message.receiver, message.deposit);

        // メッセージの保留状態を解除します。
        message.isPending = false;

        emit MessageConfirmed(message.receiver, _index);
    }

    // メッセージ受け取りを却下して, AVAXをメッセージ送信者へ返却します。
    function deny(uint256 _index) public payable {
        Message storage message = sefeAccessToMessage(msg.sender, _index);

        // 関数を呼び出したアドレスとメッセージの受取人アドレスが同じか確認します。
        require(
            msg.sender == message.receiver,
            "The caller of the contract must be equal to the receiver of the message"
        );

        // メッセージが保留中か確認します。
        require(
            message.isPending == true,
            "This message has already been confirmed"
        );

        // メッセージの送信者にavaxを返却します。
        sendAvax(message.sender, message.deposit);

        // メッセージの保留状態を解除します。
        message.isPending = false;

        emit MessageConfirmed(message.receiver, _index);
    }

    function sendAvax(address payable _to, uint256 _amountInWei) private {
        (bool success, ) = (_to).call{value: _amountInWei}("");
        require(success, "Failed to withdraw AVAX from contract");
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
