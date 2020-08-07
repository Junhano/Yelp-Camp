  let loadFile = function(event, temp) {
	let output;
	if (temp){
		output = document.querySelector(".newp");
	}
	else{
		output = document.querySelector(".editp");
	} 
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
      URL.revokeObjectURL(output.src) // free memory
    }
  };