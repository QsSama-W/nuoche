$(function(){
    // 检测是否为手机设备，非手机则显示提示且不加载其他内容
    function isMobileDevice() {
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        return mobileRegex.test(navigator.userAgent);
    }

    if (!isMobileDevice()) {
        // 清空页面内容并显示提示信息
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px 20px; font-family: sans-serif;">
                <h2 style="color: #333; margin-bottom: 20px;">请使用手机访问</h2>
                <p style="color: #666; font-size: 16px;">该页面仅支持手机设备访问，请在手机上打开</p>
            </div>
        `;
        return; // 终止后续执行
    }

    let phoneData = null;
    $.getJSON('static/data/data.json', function(data) {
        phoneData = data;
        
        // 填充页面数据
        $('#plateNumber').text(phoneData.plateNumber);
        $('#manualPhone').text(phoneData.phoneNumber);
        $('#smsBtn').attr('href', `sms:${phoneData.phoneNumber}?body=${phoneData.smsContent}`);
        
        // 执行自动拨号
        autoDial();
    }).fail(function() {
        console.error('加载号码数据失败');
        alert('获取联系信息失败，请稍后重试');
    });

    // 手动拨号切换
    $('.j-manaul').click(function(){
        $('.qrcode').hide();  
        $('.sms').show();  
    });

    // 返回扫码方式
    $('.j-qrcode').click(function(){
        $('.qrcode').show();  
        $('.sms').hide();  
    });

    // 自动拨号逻辑
    function autoDial() {
        if (!phoneData) return;
        
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        var isUc = u.indexOf('UCBrowser') > -1; 
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        
        // 跳转到拨号界面
        if (isIOS && !isUc || isAndroid || isUc) {
            window.location.href = `tel:${phoneData.phoneNumber}`;
        }
    }
});

// 复制号码功能
function copyPhoneNumber() {
    // 获取号码元素
    const phoneElement = document.getElementById('manualPhone');
    if (phoneElement && phoneElement.textContent) {
        // 复制文本到剪贴板
        navigator.clipboard.writeText(phoneElement.textContent)
            .then(() => {
                // 显示复制成功提示
                alert('号码已复制到剪贴板');
            })
            .catch(err => {
                console.error('复制失败:', err);
                alert('复制失败，请手动复制');
            });
    } else {
        alert('未获取到号码信息');
    }
}