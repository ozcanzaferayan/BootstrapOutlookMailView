$(document).ready(function() {
    loadData(sampleMailData);
    sidebarCollapseClick();
    dropdownClick();
    hoverMailActionButtons();
    bindMailListItemClick();
    bindEscKey();
    
    //$('ul.mail_items li.item ').eq(0).click();
});
$(function() {
    setResizableElements();
});

function bindMailListItemClick() {
    $('ul.mail_items li').click(function() {
        highlightMailListItem(this);  
        loadMailItem(this);
    });
}

function loadMailItem(listItem) {
    var mail = $(listItem).data('json');
    var senderImage = $(listItem).data('sender-image');
    var senderColor = $(listItem).data('sender-color');
    $('#mail_sender_image').css('background-color', senderColor);
    $('#mail_sender_image_span').text(senderImage);
    $('#mail_subject').text(mail.subject);
    $('#mail_sender_name').text(mail.from);
    $('#mail_send_date').text(mail.sentDate);
    $('#to_name').text(mail.to);
    $('#mail_body').html(mail.summary);
    var strAttachmentsHtml = '';
    for (let i = 0; i < mail.attachments.length; i++) {
        strAttachmentsHtml += '\
            <li>\
                <a href="#">\
                    <img class="attachment_image" src="./img/file_images/{{ATTACHMENT_TYPE}}.svg" onError="this.onerror=null;this.src=\'./img/file_images/file.svg\'"/>\
                    <div class="attachment_info">\
                        <span>{{ATTACHMENT_NAME}}</span>\
                        <span>{{ATTACHMENT_SIZE}}</span>\
                    </div>\
                </a>\
            </li>'
            .replace('{{ATTACHMENT_TYPE}}', mail.attachments[i].name.split('.').pop())
            .replace('{{ATTACHMENT_NAME}}', mail.attachments[i].name)
            .replace('{{ATTACHMENT_SIZE}}', mail.attachments[i].size);
    }
    $('#mail_attachments').html(mail.attachments.length > 0 ? '<ul>' + strAttachmentsHtml + '</ul>' : '');
    $('.mail_content').show(); 
}

function highlightMailListItem(listItem) {
    $(listItem).toggleClass('selected');
    $(listItem).siblings().removeClass('selected');
}

function bindEscKey() {
    $(document).keyup(function(e) {
        if (e.key === "Escape") { 
            $('.mail_content').hide();         
        }
    });
}

function sidebarCollapseClick() {
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
        $('#sidebar .navMenuText').fadeToggle(150);
    });
    triggerResize();
}

function dropdownClick() {
    $(".dropdown-menu li a").click(function() {
        var selText = $(this).text();
        $(this).parents('.btn-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
    });
}

function setResizableElements() {
    $("#list").resizable();
    $('#list').resize(function() {
        triggerResize();
    });
    $(window).resize(function() {
        triggerResize();
    });
}

function triggerResize(){ 
    $('#content').width($("#container").width() - $("#list").width());
}


function hoverMailActionButtons() {
    $(".item.container").hover(
        function() { $(this).find('.action_buttons *').toggle(); },
        function() { $(this).find('.action_buttons *').toggle(); }
    );
}

function loadData(mails) {
    var $mailItems = $('.mail_items');
    var colors = ['#ffb900', '#d83b01', '#ea4300', '#ff8c00', '#a80000', '#e81123', '#5c005c', '#b4009e', '#e3008c', '#32145a', '#5c2d91', '#b4a0ff', '#002050', '#00188f', '#0078d4', '#00bcf2', '#004b50', '#008272', '#00B294', '#004b1c', '#107c10', '#bad80a'];
    var senderColors = { };
    for (var i = 0; i < mails.length; i++) {
        var randomColor = colors[Math.floor(Math.random()*colors.length)];
        senderColors[mails[i].from] = senderColors[mails[i].from] == undefined ? randomColor : senderColors[mails[i].from];
        $mailItems.append(
            '<li class="item container" data-json=\'{{JSON}}\' data-sender-color="{{SENDER_COLOR}}" data-sender-image="{{SENDER_IMG}}">\
                <div class="sender_image" style="background-color:{{SENDER_COLOR}}">\
                    <span>{{SENDER_IMG}}</span>\
                </div>\
                <div class="mail_info">\
                    <div class="mail_sender">\
                        <span>{{SENDER}}</span>\
                    </div>\
                    <div class="mail_subject">\
                        <span>{{SUBJECT}}</span>\
                    </div>\
                    <div class="mail_summary">{{SUMMARY}}\
                    </div>\
                </div>\
                <div class="mail_actions">\
                    <div class="action_buttons">\
                        {{IMPORTANT}}\
                        {{ATTACHMENT}}\
                        {{REPLY}}\
                        <i style="display:none;" class="ms-Icon ms-Icon--Archive"></i>\
                        <i style="display:none;" class="ms-Icon ms-Icon--Delete"></i>\
                        <i style="display:none;" class="ms-Icon ms-Icon--Flag"></i>\
                    </div>\
                    <div class="mail_sent_date">\
                        <span>{{SENT_DATE}}</span>\
                    </div>\
                </div>\
            </li>'
            .replace(/{{SENDER_IMG}}/g, getSenderImageText(mails[i].name))
            .replace(/{{SENDER_COLOR}}/g, senderColors[mails[i].from])
            .replace('{{SENDER}}', mails[i].name)
            .replace('{{SUBJECT}}', mails[i].subject)
            .replace('{{SUMMARY}}', mails[i].summary.replace(/(<([^>]+)>)/ig,''))
            .replace('{{IMPORTANT}}', mails[i].isImportant ? '<i class="ms-Icon ms-Icon--Important"></i>': '')
            .replace('{{ATTACHMENT}}', mails[i].attachments.length > 0 ? '<i class="ms-Icon ms-Icon--Attach"></i>': '')
            .replace('{{REPLY}}', mails[i].isReplied ? '<i class="ms-Icon ms-Icon--ReplyAlt"></i>': '')
            .replace('{{SENT_DATE}}', mails[i].sentDate)
            .replace('{{JSON}}', JSON.stringify(mails[i]))
            );
    }
}

function getSenderImageText(senderName){
    var removedAlphanumerics = senderName.replace(/\W /g, '');
    var senderParts = removedAlphanumerics.split(' ');
    if (senderParts.length >= 2) {
        return senderParts[0].substring(0,1).toUpperCase() 
            + senderParts[1].substring(0,1).toUpperCase();
    } else {
        return senderParts[0].substring(0,1).toUpperCase();
    }

}