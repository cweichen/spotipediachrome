var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-60990296-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

chrome.tabs.getSelected(null, function(tab) {
	// Send message to content script to get artist name from page
	chrome.tabs.sendMessage(tab.id, {greeting: "hello"}, function(response) {

		if (response) {

			// Hide search box
			$("#search").hide();

			// Get artist name from page
			var artist = response.farewell;

			// Analytics
			_gaq.push(['_trackEvent', 'searchedArtist', artist]);

			// Show progress indicator (using spin.js)
			var opts = {
			  lines: 13, // The number of lines to draw
			  length: 7, // The length of each line
			  width: 4, // The line thickness
			  radius: 10, // The radius of the inner circle
			  corners: 1, // Corner roundness (0..1)
			  rotate: 0, // The rotation offset
			  color: '#eee', // #rgb or #rrggbb
			  speed: 0.8, // Rounds per second
			  trail: 60, // Afterglow percentage
			  shadow: false, // Whether to render a shadow
			  hwaccel: false, // Whether to use hardware acceleration
			  className: 'spinner', // The CSS class to assign to the spinner
			  zIndex: 2e9, // The z-index (defaults to 2000000000)
			  top: 'auto', // Top position relative to parent in px
			  left: 'auto' // Left position relative to parent in px
			};
			var target = document.getElementById('player');
			var spinner = new Spinner(opts).spin(target);

			// Get list of tracks by artist
			var trackset = {};
			$.getJSON('https://api.spotify.com/v1/search?type=track&q=artist:' + encodeURIComponent(artist), function (data) {

				// Stop progress indicator
				spinner.stop();

				// Get tracks
				$.map(data.tracks.items, function(item){
					var trackname = item.name;
					trackset[trackname] = item.id;	// Using trackname as key will remove tracks with duplicate names
				});

				// Spotify will return up to 100 tracks, limit to 20 tracks
				var idset = '';
				var i = 0;
				$.each(trackset, function (name,id){
					idset += id + ',';
					i += 1;
					if (i >= 20){
						return false;
					}
				});

				// Insert player iframe
				var playerurl = 'https://embed.spotify.com/?uri=spotify:trackset:' + encodeURIComponent(artist) + ':' + idset;
				var embed = '<iframe id="spotify" src="' + playerurl + '" frameborder="0" allowtransparency="true"></iframe>';
				$("#player").html(embed);

				// Insert Tweet iframe
				var tweet_text = "I'm listening to " + artist + " on Wikipedia with @spotipedia";
				var spotipedia_url = "https://chrome.google.com/webstore/detail/hgfjkidofjemkpgfggfpebolkbhagmbf";
				var tweet_url = 'https://platform.twitter.com/widgets/tweet_button.html?count=none&text=%E2%99%AB%20' + encodeURIComponent(tweet_text) + '&url=' + encodeURIComponent(spotipedia_url);
				var tweet_iframe = '<iframe id="tweet_iframe" allowtransparency="true" frameborder="0" scrolling="no" src="' + tweet_url + '"></iframe>';
				$("#tweet").html(tweet_iframe);

				// Insert Like iframe
				var like_iframe = '<iframe id="like_iframe" src="http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.facebook.com%2Fpages%2FSpotipedia%2F382108901861180&amp;send=false&amp;layout=button_count&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;appId=119716694842043" scrolling="no" frameborder="0" allowTransparency="true"></iframe>';
				$("#like").html(like_iframe);

			});
		}
	});
});
