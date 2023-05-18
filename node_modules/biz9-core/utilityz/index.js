/* Copyright (C) 2021 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-Utility
 */
module.exports = function(){
    module.o = function(title,str){
        if(!str){
            str=title;
            title='';
        }
        if(!str){
            str='null value';
        }
        write(title,str);
    }
    function write(title,str){
        console.log('________BIZ-PRINT---' +title.toUpperCase()+ '---START__________________');
        console.error(str);
        console.log('________BIZ-PRINT---' +title.toUpperCase()+ '---END_____________________');
    }
    module.get_guid=function(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    module.get_file_ext=function(_file_path){
        return path.extname(_file_path);
    }
    module.get_title_url=function(title){
        if(!title){
            title='';
        }
        return title.replace(/[^a-z0-9]+/ig, "_").toLowerCase();
    }
    module.get_id=function(max){
        if(!max){
            max = 99999;
        }
        var r=Math.floor(Math.random()*max)+1;
        return r;
    }
    module.get_query=function(window)
    {
        return get_query(window);
    }
    get_query=function(window)
    {
        var vars = [],hash;
        var hashes=window.location.href.slice(window.location.href.indexOf('?')+1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
    module.get_date_time_str=function(date,time) {
        //Tuesday, February 14th 2023,  at 2:39 am
        if(!time){
            return String(moment(date).format("dddd MMMM Do, YYYY"));
        }else{
            return String(moment(date+ ' ' + time).format("dddd MMMM Do, YYYY  h:mm a"));
        }
    }
    module.get_date_str=function(date) {
        //Tuesday, February 14th 2023
        if(date){
            return String(moment(date).format("dddd MMMM Do, YYYY"));
        }
        else{
            return 'Invalid Date Format';
        }
    }
    module.get_time_str=function(date) {
        if(date){
            var t = moment(date);
            return t.format("h:mm a");
        }
        else{
            var t = moment();
            return t.format("h:mm a");
        }
    }
    module.get_date_time_obj=function(date) {
        if(date){
            return moment(date);
        }
        else{
            return moment(new Date());
        }
    }
    module.get_date_time_pretty=function(date) {
        if(date){
            return prettydate.format(new Date(date));
        }
        else{
            return null;
        }
    }
    module.get_iso_str_by_date_time=function(date,time) {
        if(date){
            return moment(date+ ' ' + time).toISOString();
        }
        else{
            return moment().toISOString();
        }
    }
    module.get_slug=function(str){
        if(!str)
            return "";
        return str
            .toLowerCase()
            .replace(/ /g,'-')
            .replace(/[^\w-]+/g,'');
    }
    module.remove_money=function(n) {
        if(!n){
            n='0';
        }
        return String(n).replace('$','');
    }
    module.get_money=function(n) {
        var n = parseFloat(n);
        if(!n || isNaN(n)){
            n = 0;
        }
        return "$" + n.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
    }

    module.get_currency = function(amount) {
        return Math.round(100 * parseFloat(typeof amount === 'string' ? amount.replace(/[$,]/g, '') : amount));
    }
    module.get_cents = function(number) {
        return  parseInt((Number(number) * 100)).toString();
    }
    module.get_contains=function(value, searchFor){
        return (value || '').indexOf(searchFor) > -1;
    }
    module.remove_html_str=function(str){
        var regex = /(<([^>]+)>)/ig;
        _data = "";
        if(str){
            _data = str.replace(regex, "");
        }
        return _data;
    }
    module.get_month_title_short=function(d){
        switch(d) {
            case 1:
                return 'Jan';
                break;
            case 2:
                return 'Feb';
                break;
            case 3:
                return 'Mar';
                break;
            case 4:
                return 'Apr';
                break;
            case 5:
                return 'May';
                break;
            case 6:
                return 'Jun';
                break;
            case 7:
                return 'Jul';
                break;
            case 8:
                return 'Aug';
                break;
            case 9:
                return 'Sep';
                break;
            case 10:
                return 'Oct';
                break;
            case 11:
                return 'Nov';
                break;
            case 12:
                return 'Dec';
                break;
            default:
                return 'Jan';
        }
    }
    module.get_month_title=function(d){
        switch(d){
            case 1:
                return 'January';
                break;
            case 2:
                return 'February';
                break;
            case 3:
                return 'March';
                break;
            case 4:
                return 'April';
                break;
            case 5:
                return 'May';
                break;
            case 6:
                return 'June';
                break;
            case 7:
                return 'July';
                break;
            case 8:
                return 'August';
                break;
            case 9:
                return 'September';
                break;
            case 10:
                return 'October';
                break;
            case 11:
                return 'November';
                break;
            case 12:
                return 'December';
                break;
            default:
                return 'January';
        }
    }
    module.get_ip_address=function(callback){
        require('dns').lookup(require('os').hostname(), function (error, add, fam) {
            callback(error,add);
        })
    }
    module.text_truncate=function(str,length,ending){
        if (length == null) { length = 100;
        }
        if (ending == null) {
            ending = '...';
        }
        if (str.length > length) {
            return str.substring(0, length - ending.length) + ending;
        } else {
            return str;
        }
    }
    module.validate_email=function(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    module.set_file_upload=function(req,_file_path,callback){
        req.busboy.on('file',(fieldname,file,filename)=>{
            const fstream = fs.createWriteStream(path.join(_file_path,filename.filename));
            file.pipe(fstream);
            fstream.on('close', ()=>{
                callback(filename.filename);
            });
        });
    }
    module.set_resize_photo_file=function(org_file,sizes,callback){
        /*
        var sizes = [{
            path: file_path+'a' + new_filename,
            xy: 800
        },{
            path: file_path+'b' + new_filename,
            xy: 300
        },{
            path: file_path+'c' + new_filename,
            xy: 100
        }];
        */
        Promise.map(sizes, function(size) {
        sharp(org_file)
                .resize(size.xy)
                .toFile(size.path,(error,info)=>{
            });
        }).then(function(x){
            callback();
        });
    }
    module.set_resize_square_photo_file=function(org_file,sizes,callback){
        /*
        var sizes = [{
            path: file_path+'a' + new_filename,
            xy: 800
        },{
            path: file_path+'b' + new_filename,
            xy: 300
        },{
            path: file_path+'c' + new_filename,
            xy: 100
        }];
        */
        Promise.map(sizes, function(size) {
        sharp(org_file)
                .resize(size.xy, size.xy,{fit:sharp.fit.fill,quality:100})
                .toFile(size.path,(error,info)=>{
            });
        }).then(function(x){
            callback();
        });
    }
    module.set_photo_file=function(file_path,org_filename,new_filename,callback){
        sharp(file_path+org_filename)
            .toFile(file_path+new_filename, (error, info) => {
                callback(error,new_filename);
            });
    }
    module.get_file_buffer=function(file_path,callback){
        fs.readFile(file_path,function(error, buffer){
            callback(error,buffer);
        })
    }
    module.get_mp3_duration=function(secs){
        millisec = secs * 1000;
        duration = format(millisec);
        return duration;
    }
    module.get_paging_list=function(data_list,current_page,page_size,callback){
        if(current_page>=1||!current_page){
            current_page=1;
        }
        item_count = data_list.length;
        skip = page_size * (current_page - 1);
        page_count = Math.ceil(item_count / page_size);
        new_data_list = data_list.slice(skip, skip + page_size);
        callback(new_data_list,item_count,page_count);
    }
    module.get_older_date=function(date_1,date_2){
        if(date_1.getTime() < date_2.getTime()){
            return 'date1';
        }else{
            return 'date2';
        }
    }
    return module;
}

