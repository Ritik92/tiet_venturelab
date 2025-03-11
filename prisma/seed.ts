const { sendVerificationEmail }  =require("../lib/email");

const res=sendVerificationEmail(
    'kartik292004@gmail.com',
    'Ritik',
    'https://example.com/verify',
)
console.log(res)