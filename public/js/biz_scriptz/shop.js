//get_cart_view();
function get_cart_view(){
    $('#ul_cart_list').html('');
    $.ajax({
        type: "GET",
        url: "/shop/get_cart_view",
        enctype: 'multipart/form-data',
        data: {},
        success: function(data){
            full_str = ''
            for(a=0;a<data.helper.product_list.length;a++){
                str = "<li class='woocommerce-mini-cart-item mini_cart_item clearfix'>"+
                    "<a class='product-image' href='/shop/"+data.helper.product_list[a].item_title_url+"'>"+
                    "<img src='"+data.helper.product_list[a].thumb_photo_url+"' alt='cart-1'>"+
                    "</a>"+
                    "<a class='product-title' href='/shop/"+data.helper.product_list[a].item_title_url+"'>"+data.helper.product_list[a].item_title+"</a>"+
                    "<span class='quantity'>"+data.helper.product_list[a].quantity+
                    "x <span class='woocommerce-Price-amount amount'>"+
                    "<span class='woocommerce-Price-currencySymbol'></span>"+data.helper.product_list[a].item_group_price+
                    "</span>"+
                    "</span>"+
                    "<a href='#' class='remove btn_remove_product_cart' tbl_id='"+ data.helper.product_list[a].tbl_id +"'    >"+
                    "<span class='lnr lnr-cross'></span>"+
                    "</a>"+
                    "</li>";
                full_str = full_str+str;
            }
            $('#ul_cart_list').html(full_str);
            $('#sp_sub_total').html(data.helper.cart_price_total);

            $('.btn_remove_product_cart').click(function(event){
                tbl_id = $(this).attr('tbl_id');
                $.ajax({
                    type: "POST",
                    url: "/shop/remove_cart/"+tbl_id,
                    enctype: 'multipart/form-data',
                    data: {},
                    success: function(data){
                        get_cart_view();
                    }
                });

                return false;
            });

        }
    });
    return false;
}
$('.btn_remove_product_cart').click(function(event){
                tbl_id = $(this).attr('tbl_id');
                $.ajax({
                    type: "POST",
                    url: "/shop/remove_cart/"+tbl_id,
                    enctype: 'multipart/form-data',
                    data: {},
                    success: function(data){
                        get_cart_view();
                    }
                });

                return false;
});


$('#btn_add_product_cart').click(function(event){
    tbl_id = $(this).attr('tbl_id');
    data_type = $(this).attr('data_type');
    quantity = $('#quantity').val();
    if(!quantity){
        quantity=1;
    }

    $.ajax({
        type: "POST",
        url: "/shop/update_cart/"+data_type+"/"+tbl_id,
        enctype: 'multipart/form-data',
        data: {tbl_id:tbl_id,data_type:data_type,quantity:quantity},
        success: function(data){
            window.location='/shop/cart';
        }
    });
    return false;
});
$('#btn_pay_checkout').click( function() {
    event.preventDefault();
    first_name = $('#tb_item_first_name').val();
    last_name = $('#tb_item_last_name').val();
    company = $('#tb_item_company').val();
    street_address = $('#tb_item_street_address_1').val() +" " +  $('#tb_item_street_address_2').val();
    zip = $('#tb_item_zip').val();
    state = $('#tb_item_state').val();
    phone = $('#tb_item_phone').val();
    email = $('#tb_item_email').val();
    note = $('#tb_item_note').val();
    if(!first_name){
        alert('Please enter a valid first name.');
    }else if(!street_address){
        alert('Please enter a valid street address.');
    }else if(!email ||!validate_email(email)){
        alert('Please enter a valid email.');
   }else if(!email ||!validate_email(email)){
        alert('Please enter a valid email.');
    }else{
         $.ajax({
            url: '/shop/create-checkout-session',
            type: 'POST',
            dataType: 'json',
            data: {first_name:first_name,last_name:last_name,company:company,street_address:street_address,zip:zip,phone:phone,email:email,note:note,state:state},
            success: function(data) {
                if(data.helper.validation_message){
                    alert(data.helper.validation_message);
                }else{
                    window.location=data.helper.checkout_url;
                }
            }
        });
    }
});

