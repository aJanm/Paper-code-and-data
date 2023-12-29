// 登录和注册
$(function(){
    var registerBox = $('#registerBox');
    registerBox.find('.register-primary').on('click',function(){
        $.ajax({
            type:'POST',
            url:'users/register',
            data:{
                usrname:registerBox.find('[name="usrname"]').val(),
                password:registerBox.find('[name="password"]').val(),
                password:registerBox.find('[name="password2"]').val()
            },
            dataType:'json',
            success:function(result){
                alert(result.message);
            }
        });
    });
}); 