(function($){
	$(ready);

	function ready(){

		if(Response.band(0,767)){
			$('.js-mobile-dtl-slider').each(mobileDetailViewer);
		}

	}

	function mobileDetailViewer(){
		var w = $(window).outerWidth(),
			box = $(this),
			views = $('.js-mobile-dtl-view'),
			$origin;

		box.width(w*2);
		views.width(w);

		function mobileDetailSlider(){
			var $this = $(this), fund = {},
			thisFund = $('#details_fund'),
			thisCaption = $('#acct_details_tbl'),
			thisBal = $('#mobi_dtls_bal'),
			thisPct = $('#mobi_dtls_pct'),
			thisUnit = $('#mobi_dtls_unit'),
			thisVal = $('#mobi_dtls_val'),
			thisDate = $('#mobi_dtls_date');
			$origin = $this;

			//collect data
			fund = {
				name: $('th[scope="row"]', $this).text(),
				balance : $('.js-mobile-dtl-bal', $this).text(),
				percent : $('.js-mobile-dtl-pct', $this).text(),
				units : $('.js-mobile-dtl-unit', $this).text(),
				unitVal : $('.js-mobile-dtl-val', $this).text(),
				date : $('#balance_date_label').text()
			};

			//assign data
			thisFund.text(fund.name);
			thisCaption.text('Details for ' + fund.name + ' fund');
			thisBal.text(fund.balance);
			thisPct.text(fund.percent);
			thisUnit.text(fund.units);
			thisVal.text(fund.unitVal);
			thisDate.text(fund.date);

			var dtlHt = $('.mobile__account-details').outerHeight();
			box.css('left', -w);
			$('.js-mobile-dtl-view').eq(0).height(dtlHt).attr('aria-hidden', 'true');
			$('.js-mobile-dtl-view').eq(1).attr('aria-hidden', 'false').focus();
			$('.js-mobi-slider-noview').addClass('hidden');
			$('body, html').animate( { scrollTop: $('.js-mobile-dtl-slider').offset().top - 30 });
		}

		function returnToSummary(){
			box.css('left', 0);
			$('.js-mobile-dtl-view').eq(0).height('').attr('aria-hidden', 'false');
			$('.js-mobile-dtl-view').eq(1).attr('aria-hidden', 'true');
			$('.js-mobi-slider-noview').removeClass('hidden');
			$('body, html').animate( { scrollTop: $origin.offset().top - 30 }, 250 );
			$origin.focus();
		}

		//do something
		$('.js-mobile-dtl-fund', box).on('click', mobileDetailSlider);
		$('.js-return-to-summary').on('click', returnToSummary);
	}

})(jQuery);
