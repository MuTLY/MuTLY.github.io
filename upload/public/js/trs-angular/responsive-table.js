// Responsive table
(function(){
	var app = angular.module('TRS.ResponsiveTable', ['ngAnimate', 'TRS.ResponsiveTable.config']);

	app.directive('trsResponsiveTable', function($window, BASE_PATH, APP_BUILD, TEMPLATE_EXTENSION){
		return {
			scope: { dataVariable: '@variable' },
			controller: 'trsResponsiveTableController',
			templateUrl: BASE_PATH + '/responsive-table.' + TEMPLATE_EXTENSION + '?v=1.0.2-' + APP_BUILD,
			link: link
		};

		function link(scope, element, attrs) {
			scope.isMobile = isMobile();
			angular.element($window).bind('resize', function(){
				scope.isMobile = isMobile();

				// Manual $digest required on resize
				scope.$digest();
			});

			function isMobile() {
				return $window.innerWidth < 768;
			}
		}
	}).controller('trsResponsiveTableController', function($rootScope, $scope, $log, $window, $timeout){

		// Allow receiving data from external sources
		// Example: angular.element('#[insert ng-app element id here]').scope().$broadcast('setTableData', { your data object here });
		$rootScope.$on('setTableData', function(event, data){
			if (!!data) {
				$scope.data = data;
				$scope.$apply();
			}
		});

		$scope.$watch('data', function(newVal, oldVal) {
			if (!angular.equals(newVal, oldVal)) {
				initTableData();
			}
		});

		if ($scope.dataVariable && $window[$scope.dataVariable]) {
			$scope.data = $window[$scope.dataVariable]; // Get from global with the given name
		}

		function initTableData() {
			if (!$scope.data) {
				return;
			}

			// Ensure column order for all rows
			var i;
			$scope.columnIDs = [];
			for(i=0; i<$scope.data.columns.length; i++) {
				var column = $scope.data.columns[i];
				if (!!column && !!column.id) {
					$scope.columnIDs.push(column.id);
				}
			}
		}

		$scope.$watch('isMobile', function(){
			$timeout(function(){
				try {
					initScrollableTables();
				} catch (e) {
					//$log.warn("Could not initScrollableTables();", e)
				}
			});
		});

		$scope.setActiveRow = function(theRow) {
			if ($scope.activeRow === theRow) {
				$scope.unsetActiveRow();
			} else {
				$scope.activeRow = theRow;
			}
		}

		$scope.unsetActiveRow = function() {
			delete $scope.activeRow;
		}
	}).filter('mobileHighlightsOnly', function(){
		return function(items){
			if (!items) {
				return items;
			}

			var returns = [];
			items.slice().forEach(function(item){
				if (item.isMobileHighlight) {
					returns.push(item);
				}
			});
			return returns;
		};
	}).filter('reverse', function(){
		return function(items){
			if (!items) {
				return items;
			}

			return items.slice().reverse();
		};
	});
}());
