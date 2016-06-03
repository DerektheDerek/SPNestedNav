/*

Object DepartmentsList[string DeptCategory][string Department]

Ex.
DepartmentsList["Chemical Operations"]["Ammonia"].Link

*/			

var ListName = 'Departments';	//This can be whatever your list name is actually called. 
var DepartmentList = {}; 
var DepartmentLink;

// Pull async JSON data for Departments list
jQuery.ajax({
   url: "http://"+ window.location.hostname + "/_api/web/lists/getbytitle('Departments')/items?$orderBy=Category,Title",
   method: "GET",
   headers: { "Accept": "application/json; odata=verbose" },
   success: function (data) {
        if (data.d.results.length > 0 ) {	//We found items in the specified list
        	var ListItem
        	//Get the categories (top level metadata) for the list
            for(i=0;i<data.d.results.length;i++){
               ListItem = data.d.results[i];                    
               DepartmentList[ListItem.Category] = [];		//initializes an array for each category which will 
            }
             
            //Another loop to populate the types with the department objects
            for(var key in DepartmentList){
             	for(i=0;i<data.d.results.length;i++){
             		ListItem = data.d.results[i];
             		if(key==ListItem.Category){
             			DepartmentList[key].push({
             				Title: ListItem.Title,
             				Link : ListItem.Link.Url,
             				GUID : ListItem.GUID,
             				Type : ListItem.__metadata.type,
             				Cat  : ListItem.Category
               			});	                 			
             		}
             	}
            }
        }
        
        //DepartmentList is now populated, now generate markup for dropdown menu
        
        DepartmentLink = jQuery(".ms-navedit-flyoutArrow:contains('Departments')");  //Ensure that 'Departments' here is actually within the text of the nav bar or this will not work.

	  	var TypeBox = GenerateBox(DepartmentList); 							//GenerateBox() returns a string containing all of the markup

		jQuery(DepartmentLink).parent().parent().append(TypeBox);  			//had to play with this to find the right place to create a node
	  	jQuery(DepartmentLink)
	  		.mouseenter(function(){
	  			jQuery("#DepartmentDropdown").removeClass("hidden");        //show the dropdown box on mouse over
	  		});

	  	jQuery(document).click(function(e){ 				
	  		var ClickedElement = jQuery(e.target);			
			if(!ClickedElement.hasClass('category'))	         
			{				
	  			jQuery("#DepartmentDropdown").addClass("hidden");			//hide the dropdown list if the user clicks off of it  			
	  		} 
	  	});					

		jQuery("li[class='category']").each(function(e){
			jQuery(this).click(function(e){
				jQuery(this).next().slideToggle();					//show departments when user clicks a category
			});
		});			  	
	  	

	  	// This guy just iterates the object properties to produce a string of markup
	  	function GenerateBox(DepartmentList){     
			var string = "<div id='DepartmentDropdown' class='hidden'><ul id='DepartmentTypes'>";
			for(var Category in DepartmentList)
			{

              	string += "<li class='category'>" + Category + "</li>";
              	string += "<ul class='Departments' style='display:none !important'>";
              	for(var Item in DepartmentList[Category]){
              		Department = DepartmentList[Category][Item];
              		string += "<li class='department'><a href='"+ Department.Link + "'>" + Department.Title + "</a></li>";
          		}

          		string += "</ul>";
          	}
		    string += "</ul></div>";
			return string;
 		}
    },
    error: function (data) {
    	console.log("Error: "+ data);
  	}
});
