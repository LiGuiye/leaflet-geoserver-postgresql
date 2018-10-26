//定义地图和地图标注
//智图
var Geoq = L.tileLayer.chinaProvider('Geoq.Normal.Map', {
	maxZoom: 18,
	minZoom: 5
});

//================================WFS服务=============================================
//WFS服务的完整路径
var url = "http://localhost:8080/geoserver/liguiye/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=liguiye%3Apoempoint&maxFeatures=250&outputFormat=application%2Fjson"
//创建一个空的GeoJSON图层并将其分配给变量，以便以后可以添加更多功能
var myLayer = L.geoJSON(null, {

	onEachFeature: function(feature, marker) {
		marker.bindPopup(
			feature.properties.poemname
		);
		shiming = feature.properties.poemname;
		//鼠标悬浮的时候显示一段话
		//marker.bindTooltip("my tooltip text").openTooltip();
	}
});
//ajax调用
$.ajax({
	url: url, //WFS服务的完整路径
	dataType: 'json',
	outputFormat: 'text/javascript',
	success: function(data) {
		//将调用出来的结果添加至之前已经新建的空geojson图层中
		myLayer.addData(data);
//		ajax刷新了一次,一次获取了所有的数据
		//console.log(data.features[0].properties.poemname);
	},
});

//将以上资源加入图层集，便于控件调用
var Geoq = L.layerGroup([Geoq]);

//右侧的图层控件
var baseLayers = {
	"智图": Geoq
}
var overlayLayers = {
	"诗词位置wfs": myLayer,
}
//将地图内容与容器绑定
var map = L.map('map', {
	center: [30.58141017095, 114.329577684],
	zoom: 1,
	//默认图层
	layers: [Geoq],
	zoomControl: false
});

//右边的图层控件
L.control.layers(baseLayers, overlayLayers).addTo(map);