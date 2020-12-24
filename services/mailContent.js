exports.getConfirmMationMailContent = (fullName, key) => {
  return `
    <div style="margin: 0; padding: 20px; width: 100%; background-color: #efefef">
        <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            style="margin: 0 auto; padding: 0; table-layout: fixed"
        >
            <tr>
            <td>
                <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                style="
                    margin: 0 auto;
                    padding: 0;
                    table-layout: fixed;
                    background-color: white;
                "
                >
                <tbody>
                    <tr
                    style="
                        border-collapse: collapse;
                        border-spacing: 0;
                        padding: 0;
                        margin: 0;
                    "
                    >
                    <td
                        style="
                        max-width: 500;
                        width: 600px;
                        border: 1px solid #e3e3e3;
                        padding: 25px;
                        "
                    >
                        <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="width: 100%"
                        >
                        <tbody>
                            <tr>
                            <td>
                                Chào ${fullName},<br />
                                <br />
                                Chúng tôi nhận được yêu cầu đăng ký tài khoản của bạn
                                trên Online Academy.<br />
                                Nhấn vào nút kích hoạt bên dưới để hoàn tất việc đăng ký
                                tài khoản.
                            </td>
                            </tr>
                        </tbody>
                        </table>

                        <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="width: 100%"
                        >
                        <tbody>
                            <tr>
                            <td style="text-align: center; height: 80px">
                                <a
                                style="
                                    background-color: mediumblue;
                                    color: white;
                                    text-decoration: none;
                                    padding: 10px 20px;
                                    border-radius: 5px;
                                "
                                href="${process.env.HOST}/active-account/${key}"
                                >KÍCH HOẠT</a
                                >
                            </td>
                            </tr>
                        </tbody>
                        </table>
                        <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="width: 100%"
                        >
                        <tbody>
                            <tr>
                            <td style="text-align: center">
                                Nếu bạn gặp vấn đề với nút kích hoạt phía trên, <br />
                                hãy copy đường dẫn bên dưới vào thanh địa chỉ của trình
                                duyệt
                            </td>
                            </tr>
                        </tbody>
                        </table>

                        <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="width: 100%; margin: 10px 0px"
                        >
                        <tbody>
                            <tr>
                            <td style="text-align: center; font-size: 0.8em">
                                <a
                                href="${process.env.HOST}/active-account/${key}"
                                >${process.env.HOST}/active-account/${key}</a
                                >
                            </td>
                            </tr>
                        </tbody>
                        </table>

                        <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="width: 100%; margin-bottom: 20px"
                        >
                        <tbody>
                            <tr>
                            <td>
                                Cảm ơn,<br />
                                Online Academy Team
                            </td>
                            </tr>
                        </tbody>
                        </table>

                        <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="width: 100%"
                        >
                        <tbody>
                            <tr>
                            <td style="color: #808080; font-size: 0.9em">
                                Nếu bạn không phải người gửi yêu cầu này, hãy bỏ qua
                                email này
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                    </tr>
                </tbody>
                </table>
                <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
                style="width: 100%; margin-bottom: 20px; margin-top: 10px"
                >
                <tbody>
                    <tr>
                    <td style="text-align: center; color: #808080">
                        Bạn nhận được email này từ hệ thống tự động của Online Academy.
                        <br />
                        Vui lòng không trả lời email này. <br />
                        <br />
                        <i>Online Academy - 2020</i>
                    </td>
                    </tr>
                </tbody>
                </table>
            </td>
            </tr>
        </table>
    </div>
    `;
};
