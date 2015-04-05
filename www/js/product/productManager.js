/*global angular*/
angular.module('replenishment').service('productManager', ['authentication', 'settingsManager', 'productData', function (authentication, settingsManager, products) {
	'use strict';

	var self = this;
    
    function getColor(colors, id) {
        var i, color;
        
        for (i = 0; i < colors.length; i += 1) {
            if (colors[i].id === id) {
                color = colors[i];
                break;
            }
        }
        
        return color;
    }
    
    function getSize(sizes, id) {
        var i, size;
        
        for (i = 0; i < sizes.length; i += 1) {
            if (sizes[i] === id) {
                size = sizes[i];
                break;
            }
        }
        
        return size;
    }
    
    function getScent(scents, id) {
        var i, scent;
        
        for (i = 0; i < scents.length; i += 1) {
            if (scents[i] === id) {
                scent = scents[i];
                break;
            }
        }
        
        return scent;
    }
    
    function getProductName(product) {
        var name = '';
        
        if (settingsManager.getValue(settingsManager.settings.useEcommerceName) === true) {
            name = product.eCommerceName;
        } else {
            name = product.RMSName;
        }
        
        return name;
    }
    
    function getSelectedSkuData(product, skuData) {
        return {
            sku: skuData.sku,
            price: skuData.price,
            color: getColor(product, skuData),
            size: getSize(product, skuData),
            scent: getScent(product, skuData)
        };
    }
    
	self.findByParentId = function (productCode) {
		var i, j, product;
        
        for (i = 0; i < products.length; i += 1) {
            if (products[i].productCode === productCode) {
                product = products[i];
                product.name = getProductName(product);
                break;
            }
        }
        
        return product;
	};

	self.findBySku = function (sku) {
        var i, j, product;
        
        for (i = 0; i < products.length; i += 1) {
            if (products[i].children[sku]) {
                product = products[i];
                product.name = getProductName(product);
                product.selectedSku = getSelectedSkuData(product, products[i].children[sku]);
                break;
            }
        }
        
        return product;
        
//		return {
//			parentId: '12345',
//			sku: sku,
//			price: 19.90,
//			name: 'Vestido ' + sku,
//			division: 'Feminino',
//			group: 'Blue Steel',
//			color: 'Azul arara',
//			colorId: '12-43214-PT',
//			size: 'M',
//			pictureSmallUrl: 'assets/img/vestido.jpg'
//		};
	};

}]);