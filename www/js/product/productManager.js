/*global angular*/
angular.module('replenishment').service('productManager', ['authentication', function (authentication) {
	'use strict';

	var self = this;
	
	self.findByParentId = function (parentId) {
		return [
			{
				parentId: parentId,
				sku: parentId + '123',
				price: 19.90,
				name: 'Vestido 123',
				division: 'Feminino',
				group: 'Blue Steel'
			},
			{
				parentId: parentId,
				sku: '456',
				price: 19.90,
				name: 'Vestido 456',
				division: 'Feminino',
				group: 'Blue Steel'
			},
			{
				parentId: parentId,
				sku: '789',
				price: 19.90,
				name: 'Vestido 789',
				division: 'Feminino',
				group: 'Blue Steel'
			}
		];
	};

	self.findByChildId = function (sku) {
		return {
			parentId: '12345',
			sku: sku,
			price: 19.90,
			name: 'Vestido ' + sku,
			division: 'Feminino',
			group: 'Blue Steel',
			color: 'Azul arara',
			colorId: '12-43214-PT',
			size: 'M',
			pictureSmallUrl: 'assets/img/vestido.jpg'
		};
	};

}]);