/** 
	* THIS IS POWPA HELPER
	* this is an assistant for users.
	* use it when you want to add more information about an input field.
	**/


    /**
     * 
     * This is a sample helper label
     <div class="mt-3">
		<label class="helper-label">
			<span class="label">Description</span>
			<span class="pwp-helper" 
	          help="Write the full description of this product here, you may also write reasonable detailed infomation"
			  clicked="false"><i>help?</i>
			</span>
		</label>
		<textarea placeholder="Description" data-field="description" class="input-look all_value required"></textarea>
	  </div>
     */
	
	$(document).on('click', '.pwp-helper', function(){
		$(this).attr('clicked', 'true');
		$(this).next().find('.helper-text').show();
	})
	
	$(document).on('mouseleave', '.pwp-helper', function(){
		if($(this).attr('clicked') === 'true'){
			return;
		}
		
		const item = $(this).next().find('.helper-text')
		pwp.helperTimeout = setTimeout(() => {
			item.hide();
		},300)
		
	})
	
	$(document).on('mouseenter', '.pwp-helper', function(){
		$(this).next().find('.helper-text').show();
	})
	
	$(document).on('mouseenter', '.pwp-helper-text-div', function(){
		if(pwp.helperTimeout){
			clearTimeout(pwp.helperTimeout);
		}
	})
	
	$(document).on('mouseleave', '.pwp-helper-text-div', function(e){
		pwp.helperTimeout = 0;
		const clicked = $(e.target).parentsUntil('.helper-label').parent().find('.pwp-helper').attr('clicked');
		
		const item = $(this).find('.helper-text');
		if(clicked === 'false'){
			pwp.helperTimeout = setTimeout(() => {
			   item.hide();
		    },300)
		}
		
	})
	
	$(document).on('click', '.helper-hide', function(){
		$(this).parentsUntil('.helper-text').parent().hide();
		$(this).parentsUntil('.helper-label').parent().find('.pwp-helper').attr('clicked', 'false');
	})
	
	pwp.addHelp = () => {
		pwp.helperTimeout = 0;
		const help = $('.pwp-helper');
		const baseHeight = 45;
		if(!help.length){
			return;
		}
		
		for(let i = 0; i < help.length; i++){
		  const text = help.eq(i).attr('help');
		  const htm = `
            <div class="pwp-helper-text-div">
		      <div class="t-pit dnone helper-text">
                <div><div class="helper-hide tx-20 pointer">&times;</div></div>
                <div class="tx-13">${text}</div>
                <div class="pwp-helper-anchor">
                 
                </div>
              </div>
		    </div>`;
			if(!help.eq(i).parent().find('.pwp-helper-text-div').length){
				help.eq(i).parent().append(htm);
		        help.eq(i).parent().find('.helper-text').css({bottom: `${help.eq(i).parent().find('.helper-text').height()+baseHeight}px`});
			}
		}
	}
	
	pwp.addHelp();




    pwp.json = (str) => {
        const index = str.indexOf(('{'||'['));
        if(index < 0){
            return false;
        }
        return JSON.parse(str.substring(index).trim());
    }


    function traverseTheDom(node = $('body')){
        // return the title if exists
        if(document.title){
            return document.title;
        }
        
        // return content of any h1 element if it exists
        if(node.find('h1').length){
            return node.find('h1').text();
        }else if(node.find('div').text()){
            return node.find('div').text();
        }
    
        if(!node.children().length){
            if(node.next().length){
                traverseTheDom(node.next());
            }
            
        }
        
    
        if(node.children().length){
            return node.next().length ? traverseTheDom(node.next()) : traverseTheDom(node.children());
        }
    
    }
    
    function displayTitle(title){
        for(let i=0;i<title.length;i++){
            if(title[i].match(/\w+/,'')){
               return title[i].trim();
            }
        }
        return '';
    }

    const pageTitle = traverseTheDom();
	const title = pageTitle.split('\n');
	document.title = displayTitle(title);



    pwp.filter = (str, obj, elementObject, fields = []) => {
	
        //transferData
        const el = elementObject.find('.data-row');

		// Store these values to reuse them during paginated navigation
		// With these, search can be persisted during paginated navigations
		pwp.searchKeyWord = str;
		pwp.searchObj = obj;
		pwp.searchElementObject = elementObject;
		pwp.searchFields = fields;
        
        let word = '';
        if(!el.length){
            pwp.showToast('Element is empty', 'danger', false);
            return;
        }
        if(!str){ 
            /**
             * The string is empty, so remove the filter
             */
            pwp.unfilter(el)
        }

        const searchWord = str.toLowerCase();
        let exists = false;
        // Checking if the keyword actually exists in the data
        for(let i = 0; i < obj.length; i++){
            let t = obj[i];
            if(typeof fields == 'string'){
                if(fields != 'ALL_FIELDS'){
					const item = obj[i][fields];
					if(!item){
						continue;
					}
                    if(item.toLowerCase() == searchWord){
                        exists = true;
                    }
                }else{
                    for(let j in t){
                        word += ` ${obj[i][j]}`;
                    }
                    word = word.trim();
                    if(word.toLowerCase().indexOf(searchWord) > -1){
                        exists = true;
                    }
                }
            }else if(typeof fields == 'array'){
                for(let j in fields){
                    word += ` ${obj[i][fields[j]]}`;
                }
                if(word.toLowerCase().indexOf(str) > -1){
                    exists = true;  
                }
            }

            if(exists){
                // if there's 
                break;
            }
        }
        
        // If the keyword was not found, display everything
        if(!exists){
			if(fields == 'ALL_FIELDS'){
				pwp.unfilter(el);
			}else{
				pwp.unfilter(el);
				pwp.showToast(`${searchWord} not found`, 'warning', false);
			}
            
            return;
        }

		for(let i = 0; i < obj.length; i++){
			let t = obj[i];
            let word = '';

            // They are searching from a string
            if(typeof fields == 'string'){

                // They are searching a specific field
				
                if(fields != 'ALL_FIELDS'){
					const item = obj[i][fields];
					if(!item){
						el.eq(i).hide();
					}else if(item.toLowerCase() == searchWord){
                        el.eq(i).show();
                    }else{
                        el.eq(i).hide();
                    }
                }else{
                    for(let j in t){
                        word += ` ${obj[i][j]}`;
                    }
                    word = word.trim();
                    if(word.toLowerCase().indexOf(searchWord) > -1){
                        el.eq(i).show();
                    }else{
                        el.eq(i).hide();
                    }
                }
            }else if(typeof fields == 'array'){
                for(let j in t){
                    word += ` ${obj[i][fields[j]]}`;
                }

                if(word.toLowerCase().indexOf(str) > -1){
                    el.eq(i).show();
                }else{
                    el.eq(i).hide();
                }
            }   
		}
	};

    pwp.dateInWords = (dateString) => {
        const date = dateString.replace(/-0/g,'-');
        const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', "Saturday", "Sunday"];
        const sufix = {"0": "th", "1": "st", "2": "nd", "3": "rd", "4": "th", "5": "th", "6": "th", "7": "th", "8": "th", "9": "th"};
        const datePieces = date.split('-');
        datePieces[1].length
        return ` 
        ${datePieces[2]}${sufix[datePieces[2].split('')[datePieces[2].split('').length-1]]} 
        ${monthsOfYear[Number(datePieces[1])-1]},
        ${datePieces[0]}`;
    };
    
    //console.log(pwp.dateInWords('2022-05-10'))


    const ICONS = `
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
  </symbol>
  <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
  </symbol>
  <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
  </symbol>
</svg>`;

// Initialize all types of alerts available for consumption
// At the time of calling 
const ALERTS = {
primary: 
 `
<div class="alert alert-primary d-flex align-items-center" alert-dismissible fade show z-max-2" 
  style="z-index:900000000009;position:fixed;left:calc(50vw - 150px);top:0px;width:300px;" id="globalToast"
  role="alert">
  <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:"><use xlink:href="#info-fill"/></svg>
  <div style="width:200px;overflow:hidden;">
    #msg#
  </div>
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`
,
success: 
 `
<div class="alert alert-success d-flex align-items-center alert-dismissible fade show z-max-2" 
  style="z-index:900000000009;position:fixed;left:calc(50vw - 150px);top:0px;width:300px;" id="globalToast"
  role="alert">
  <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>
  <div style="width:200px;overflow:hidden;">
    #msg#
  </div>
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`
,
warning: 
 `
<div class="alert alert-warning d-flex align-items-center alert-dismissible fade show z-max-2"
  style="z-index:900000000009;position:fixed;left:calc(50vw - 150px);top:0px;width:300px;" id="globalToast"
  role="alert">
  <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
  <div style="width:200px;overflow:hidden;">
    #msg#
  </div>
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`
,
danger: 
 `
<div class="alert alert-danger d-flex align-items-center alert-dismissible fade show z-max-2"
  style="z-index:900000000009;position:fixed;left:calc(50vw - 150px);top:0px;width:300px;" id="globalToast"
  role="alert">
  <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
  <div style="width:200px;overflow:hidden;">
    #msg#
  </div>
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`,

};







pwp.blur = (message='') => {
    pwp.unblur();
	
	let el = `<div class="blur-box" style="position:fixed;left:0px;top:0px;width:100vw;height:100vh;background-color:black;opacity:.5;z-index:90000000"></div>
               <div class="blur-message" style="z-index:90000001;position:fixed;left:calc(50vw - 75px);top:45vh;width:250px;text-align:center;">
                 
                   <div class="spinner-border" role="status" style="width:100px;height:100px;color:rgba(0, 121, 68,1);">
                     <span class="visually-hidden">Loading...</span>
                   </div>
                   <div class="pt-2" style="color:rgba(0, 121, 68,1);">${message}</div>
                 
               </div>`;
	$('body').append(el);
};

pwp.showModal = message => {
	pwp.blur(message);
};

pwp.hideModal = () => {
	pwp.unblur();
}

pwp.unblur = () => {
	$('.blur-box').remove();
	$('.blur-message').remove();
};


pwp.showToast = (message, alertType="primary", permanent = false) => {
	pwp.hideToast();
	let dom = '';
	if(alertType == 'primary'){
		dom = ALERTS.primary.replace(/#msg#/,message);
	}else if(alertType == 'success'){
		dom = ALERTS.success.replace(/#msg#/,message);
	}else if(alertType == 'warning'){
		dom = ALERTS.warning.replace(/#msg#/,message);
	}else if(alertType == 'danger'){
		dom = ALERTS.danger.replace(/#msg#/,message);
	}
	
	$('body').append(dom);
	//$('#globalToast').adClass('')
	
	if(!permanent){
		setTimeout(() => {
		    pwp.hideToast();
	    },8000)
	}
	
};

pwp.hideToast = () => {
	$('#globalToast').remove();
};

$(document).on('input', '.all_value', function(e) {
	if($(this).hasClass('auto-check')){
		pwp.valid1 = false;
	}
	
	if($(this).hasClass('border-danger')){
		if($(this).val().trim().length){
			$(this).removeClass('border-danger');
		}
		
		if($(this).next().hasClass('input-correction')){
			$(this).next().hide();
		}
	}
});

pwp.validateEmail = email => {
	if(!email.match(/[(\w+)(.)]+(\w+)@(\w+)\.(\w+)/)){
		return false;
	}
	return true;
};

$(document).on('change', '.all_value', function(e) {
	if($(this).hasClass('auto-check')){
		pwp.valid1 = false;
	}
	
	if($(this).hasClass('border-danger')){
		if($(this).val().trim().length){
			$(this).removeClass('border-danger');
		}
		
		if($(this).next().hasClass('input-correction')){
			$(this).next().hide();
		}
	}
});


pwp.exportCSV = (objArray, title) => {
    let arr = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str =
        `${Object.keys(arr[0])
            .map((value) => `"${value}"`)
            .join(',')}` + '\r\n';
    let csvContent = arr.reduce((st, next) => {
        st +=
            `${Object.values(next)
                .map((value) => `"${value}"`)
                .join(',')}` + '\r\n';
        return st;
    }, str);
    let element = document.createElement('a');
    element.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
    element.target = '_blank';
    /*element.download = 'export.csv';*/
	element.download = `${title}-${Date.now()}.csv`;
    element.click();
};

pwp.format = (num) => {
	const amt = `${num}`;
	if(typeof amt != 'string'){
		return false;
	}
	
	const amarr = amt.split('.');
	let amount = amarr[0];
	let rest = '';
	if(amarr.length > 1){
		rest = amarr[1];
	}
	if(amount.match(/\D/)){
		return false;
	}
	
	let b, c = '', d = '', x = ',', am = '', a;
	a = Number((amount+"").replace(/\D+/g, ''));
	if(a < 1000){
		return rest.length <= 0 ? a : `${a}.${rest}`;
	}
	
	a = `${a}`;
	b = a.split('');
	for(let j = b.length-1; j > -1; j--){
		let n = b.length - (j);
		if(n == b.length){
			return rest.length <= 0 ? b[j] + am : `${b[j] + am}.${rest}`;
		}
		
		if(n % 3 === 0){
			am = x + b[j] + am;
		}else{
			am = b[j] + am;
		}
	}
	return rest.length > 0 ? `${am}.${rest}` : am;
};

$(document).on('input', '.otpinput', function(e){
    const el = $('.otpinput');
    const val = $(e.target).val().split('');
    const n = Number($(e.target).attr('n'));
    let index = 0;
    if(val.length > 1){
        
        for(let i=n;i<el.length;i++){
            index++;
            if(el.eq(i).val().trim().length){
                //$(e.target).val(val[0]);
                continue;
            }
            if(typeof val[index] == 'undefined'){
                //$(e.target).val(val[0]);
                break;
            }
            el.eq(i).val(val[index]);
            el.eq(i).focus();
        }
        $(e.target).val(val[0]);
    }
    const otp = `${$('.otp-1').val()}${$('.otp-2').val()}${$('.otp-3').val()}${$('.otp-4').val()}${$('.otp-5').val()}${$('.otp-6').val()}`;
    $('#input-main-otp').val(otp);
    $('#formOTP').attr('action',`/login/otp_submit/${otp}/`);
    if(otp.length > 5){
        INS.blur('Submitting...')
        $('#formOTP').submit();
    }
})

function previewFile(file) {
    const preview = document.querySelector('#preview-img');
    const reader = new FileReader();

    reader.addEventListener("load", function () {
        // convert image file to base64 string
        preview.src = reader.result;
        preview.style.display = 'inline';
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}

const fileAr = [];
const fileElem = document.getElementById("formFile");
	
fileElem.addEventListener('change', function(e){
	fileAr[0] = e.target.files[0];
	previewFile(fileAr[0]);
	$('#send').show();
});


function csvToArray(str, delimiter = ",") {
    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  
    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
  
    // Map the rows
    // split values from each row into an array
    // use headers.reduce to create an object
    // object properties derived from headers:values
    // the object passed as an element of the array
    const arr = rows.map(function (row) {
      const values = row.split(delimiter);
      const el = headers.reduce(function (object, header, index) {
        object[header] = values[index];
        return object;
      }, {});
      return el;
    });
  
    return arr;
  }

function symmetricDifference(a1, a2) {
    var result = [];
    for (var i = 0; i < a1.length; i++) {
      if (a2.indexOf(a1[i]) === -1) {
        result.push(a1[i]);
      }
    }
      
    for (i = 0; i < a2.length; i++) {
      if (a1.indexOf(a2[i]) === -1) {
        result.push(a2[i]);
      }
    }
    return result;
  }

  const exportModal = () => {

    const htm = `
     <div class="p-2 border" id="csv-import-pop" style="width:300px;height:auto;position:fixed;top:200px;left:calc(50vw - 150px);z-index:1000;background-color:#fff;">
       <div class="p-2"><span id="export-pop-cancel" style="float:right;margin-right:10px;font-size:25px;cursor:pointer;">&times;</span></div>
       <div>
         <h5>Important</h5>
         <div class="alert alert-info rounded border" role="alert">
           Before you proceed, please download a sample CSV file. 
           This sample file will guide you to understand what is required.
           Each row's column is prefilled with value <b>1</b>. Replace the values with your client's data and revert.
         </div>
       </div>
       
       <button class="btn btn-secondary btn-sm btn-block mt-3" id="import-sample">Download sample CSV file</button>
       <div class="btn btn-primary btn-block mt-3 mb-2" id="start-import" style="padding-top:10px;">Start import</div>
     </div>`;
    
    $('body').append(htm);
    
}

$(document).on('click', '#import-sample', e => {
		
    //const sampleData = $('#example thead').find('th');
    const test_array = [];
    const arr1 = [];
    const arr2 = [];
    for(let i=0;i<activeProduct.length;i++){
        arr1.push(activeProduct[i]);
        arr2.push(1)
    }
    test_array[0] = arr1;
    test_array[1] = arr2;
    const csv = test_array.map(row => row.map(item => (typeof item === 'string' && item.indexOf(',') >= 0) ? `"${item}"`: String(item)).join(',')).join('\n');

    // Format the CSV string
    const data = encodeURI('data:text/csv;charset=utf-8,' + csv);

    // Create a virtual Anchor tag
    const link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', 'export.csv');

    // Append the Anchor tag in the actual web page or application
    document.body.appendChild(link);

    // Trigger the click event of the Anchor link
    link.click();

    // Remove the Anchor link form the web page or application
    document.body.removeChild(link);

});

function submitProfile(){
    const fd = new FormData();
    const id = locAr[locAr.length-2];
    fd.append('id', id);
    fd.append('edit_id', $('#edit_id').val());
    fd.append('currentimage', $('#currentimage').val());
    fd.append('profile', fileAr[0], fileAr[0].name);
    
    
    INS.blur('Submitting...');
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/profile/save/saveprofileEdit/", true);
    //xhr.responseType = 'json';
    
    xhr.onreadystatechange = function() {
       if (xhr.readyState == 4 && xhr.status == 200) {
           INS.unblur()
           console.log(xhr.responseText); // handle response.
           const jsn = INS.json(xhr.responseText)
        if(!jsn){
            INS.ToastUp('Sorry, couldn\'t complete this action')
        }else{
            if(jsn.status){
                INS.ToastUp('Profile photo updated successfully');
                //location.reload();
               //$(`.target-user-${id}`).remove();
            }else{
                INS.ToastUp('Sorry, couldn\'t complete this action')
            }
        }
       }
    };
    xhr.send(fd);
}

function CopyToClipboard(containerid) {
    if (window.getSelection) {
        if (window.getSelection().empty) { // Chrome
            window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) { // Firefox
            window.getSelection().removeAllRanges();
        }
    } else if (document.selection) { // IE?
        document.selection.empty();
    }

    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select().createTextRange();
        document.execCommand("copy");
		pwp.showToast('Code copied to clipboard', 'primary', false);
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().addRange(range);
        document.execCommand("copy");
		pwp.showToast('Code copied to clipboard', 'primary', false);
    }
}
	
	$(document).on('click', '.go-back-btn', () => {
		history.back();
	});


    const query = location.search;
    const params = new URLSearchParams(query);
    const edit = params.get("product-edit");
    const actionTarget = params.get("action");









