function showHotSpot( coords ){
	var coords_arr = coords.split(',');
	if ( coords_arr.length == 3) {
	  $('body').append("<div class='hotspot' style='display: none; z-index:100; background-color: white;'><span id='divTitle'></span>SHOW ME!</div>");
	  $('.hotspot').css({'top': parseInt( coords_arr[1] ),'left': parseInt( coords_arr[0] ), 'position':'absolute', 'border':'1px solid black', 'padding':'5px'});
	  $('.hotspot').show();
	} else {
		$('.hotspot').remove();
	}
}
$(function() {
  function initMapImage(){
    var mappedImages =  $("img[usemap]");
    mappedImages.each(function(index,img){
      var $img = $(img);
      $('.imgmap').remove();
      var $imgmap = $("<div class='imgmap'></div>");
      $img.after($imgmap);
      var imgheight = $img.height();
      var imgwidth = $img.width();
      var imgPosition = $img.position();
      $imgmap.css(
        {
         top:imgPosition.top+"px",
         left:imgPosition.left+"px",
         height:imgheight+"px",
         width:imgwidth+"px"
        });
      var mapName = $img.attr("usemap").replace("#","");
      var circles = $("map[name='"+mapName+"'] area[shape='circle']");
      circles.each(function(index,circle){
        var attrs = circle.coords.split(",");
        var alt = circle.alt;
        var size = (attrs[2]*2)+'px';
        var left = parseInt( attrs[0] ) - parseInt( attrs[2] );
        var top = parseInt( attrs[1] ) - parseInt( attrs[2] );
        var $newa = $("<div class='mapcircle'></div>");
        $imgmap.append($newa);
        $newa.css(
          {
            left: left + 'px',
            top : top  + 'px',
            width:size,
            height:size
          });
        $newa.hover( 
          function() {
            showHotSpot( circle.coords );
          }, 
          function() {
            showHotSpot( '' );
          }
        );
      });
    });
    $('.imgmap').click(function(e){
      addHotSpot( getXY(e, this) );
    });
  }
  function addHotSpot( coords ){
    var $hotspots = $('area');
    $hotspots.last().after("<area shape='circle' coords='" + coords.x + "," + coords.y + ",32' href='#' alt='HotSpot'  target='_self'/>");
    initMapImage();
  }
	function getXY( evt, element ) {
		var rect = element.getBoundingClientRect();
		var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
		var scrollLeft = document.documentElement.scrollLeft? document.documentElement.scrollLeft : document.body.scrollLeft;
		var elementLeft = rect.left+scrollLeft;  
		var elementTop = rect.top+scrollTop;
		x = evt.pageX-elementLeft;
		y = evt.pageY-elementTop;
		return {x:x, y:y};
	}	
  initMapImage();
});