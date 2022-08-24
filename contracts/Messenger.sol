// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Messenger {
    // コントラクトの所有者アドレスを保存します。
    address public owner;

    struct Message {
        uint id;
        uint depositInWei;
        uint timestamp;
        string text;
        address sender;
        address payable receiver;
    }

    Message[] allMessages;

    // 受信者がまだ未確認に留めているメッセージのidを保存しています
    mapping(address => uint[]) private receiverPendingMessages;

    // メッセージがどのアドレスにより保留中かを保存します。
    //mapping(uint => address) private pendingMessageToAdress;

    event NewMessage(
        uint id,
        uint deposit,
        uint timestamp,
        string text,
        address sender,
        address receiver
    );

    constructor() {
        console.log("Here is my first smart contract!");

        // 所有者をデプロイしたアドレスに設定します。
        owner = msg.sender;
    }

    // ユーザからメッセージを受け取り変数に格納します。
    function post(string memory _text, address payable _receiver) payable public {
        uint newId = allMessages.length;
        allMessages.push(
            Message(
                newId,
                msg.value,
                block.timestamp,
                _text,
                msg.sender,
                _receiver
            )
        );
        receiverPendingMessages[_receiver].push(newId);
        //pendingMessageToAdress[newId] = _receiver;

        emit NewMessage(
            newId,
            msg.value,
            block.timestamp,
            _text,
            msg.sender,
            _receiver
        );
    }

    function accept(uint id) payable public {
        // メッセージの受け取り人と署名者が同じか確認します。
        require(
            msg.sender == allMessages[id].receiver, 
            "The caller of the contract must be equal to the receiver of the message."
        );

        // メッセージの受取人にavaxを送信します。
        (bool success, ) = (msg.sender).call{value: allMessages[id].depositInWei}("");
        require(success, "Failed to withdraw AVAX from contract.");
    }

    function deny(uint id) payable public {
        // メッセージの受け取り人と署名者が同じか確認します。
        require(
            msg.sender == allMessages[id].receiver, 
            "The caller of the contract must be equal to the receiver of the message."
        );

        // メッセージの送信者にavaxを返却します。
        (bool success, ) = (allMessages[id].sender).call{value: allMessages[id].depositInWei}("");
        require(success, "Failed to withdraw AVAX from contract.");
    }

    function getAll() public view returns (Message[] memory) {
        // ownerのみ全てのメッセージを閲覧することができます。
        require(
            msg.sender == owner,
            "The caller of the contract must be equal to the contract owner."
        );
        return allMessages;
    }

    function getPending() public view returns (Message[] memory) {
        // 該当するメッセージを返却する
        return allMessages;
    }
}
