// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Messenger {
    // コントラクトの所有者アドレスを保存します。
    address public owner;

    constructor() {
        console.log("Here is my first smart contract!");

        // 所有者をデプロイしたアドレスに設定します。
        owner = msg.sender;
    }
}

// 管理者画面をつける, 管理者は全てのメッセージを見ることができる->管理者ではない場合のリバートのテスト
// ユーザはメッセージと共にavaxを送信する
// ユーザは自分に届いているメッセージを見ることができる, ページ遷移をする
// private rfcを使う
