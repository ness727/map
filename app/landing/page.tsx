'use client'

import { useState } from "react";

export default function Landing() {
    const [id, setId] = useState("");
    const [pwd, setPwd] = useState("");

    async function login() {
      const response = await fetch("http://localhost:8080/login", {
            method:'POST' 
            , headers: {"Content-Type": "application/x-www-form-urlencoded",}
            , body : JSON.stringify({id: id, pwd: pwd})
        })
        .then(res => {
            console.log("로그인 성공")
        })
        .catch(error => {
            console.log("로그인 실패");
        });
    }

    return (
        <div style={{margin: "10px"}}>
            <input type='text' name='id' style={{outline: "0.3rem solid"}} onChange={(e) => { setId(e.target.value) }} />
            <input type='password' style={{outline: "0.3rem solid"}} name='pwd' onChange={(e) => { setPwd(e.target.value) }} />
            <button onClick={login}>로그인</button>
        </div>
    );
}
