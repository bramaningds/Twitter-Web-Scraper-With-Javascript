function scrape() {

	tweetElements = []

	i = setInterval(function() {
		elements = Array.from(document.querySelectorAll('[data-testid="cellInnerDiv"]'))
		elements.at(-1).scrollIntoView()

		tweetElements.push(...elements)

		try {
			console.info(elements.at(-1).querySelectorAll('[data-testid="User-Name"] [href] time')[0].getAttribute('datetime'))
		}
		catch (error) {
			console.log('Stoped');
			clearInterval(i);

			console.log(
				tweetElements.map(function(tweetElement) {
					try {
						if (tweetElement.textContent.trim() == '') return undefined

						const promotedElement = Array.from(tweetElement.querySelectorAll('span')).find(e => e.textContent.trim().includes('Promoted'))
						if (promotedElement) return undefined

						const screenname = tweetElement.querySelectorAll('[data-testid="User-Name"] [href]')[0].textContent
						const username = tweetElement.querySelectorAll('[data-testid="User-Name"] [href]')[1].textContent
						const datetime = tweetElement.querySelectorAll('[data-testid="User-Name"] [href] time')[0].getAttribute('datetime')
						const url = tweetElement.querySelector('[data-testid="User-Name"] [href*="/status/"]').href
						const tweetText = tweetElement.querySelector('[data-testid="tweetText"]').textContent
						
						const sourceElement = tweetElement.querySelector('[data-testid^="card.layout"][data-testid$="detail"]')
						const source_domain = sourceElement ? sourceElement.children[0].textContent : null
						const source_title = sourceElement ? sourceElement.children[1].textContent : null
						const source_snippet = sourceElement && sourceElement.children[2] ? sourceElement.children[2].textContent : null
						
						const replies_count = tweetElement.querySelector('[data-testid=reply]').textContent
						const retweets_count = tweetElement.querySelector('[data-testid=retweet]').textContent
						const likes_count = tweetElement.querySelector('[data-testid=like]').textContent
						const views_count = tweetElement.querySelector('[href$=analytics]').textContent

						const replyElement = Array.from(tweetElement.querySelectorAll('div[dir][id]')).find(e => e.textContent.startsWith('Replying to '))
						const reply_to = replyElement ? replyElement.textContent : null

						const quoteElement = Array.from(tweetElement.querySelectorAll('span')).find(e => e.textContent == 'Quote Tweet')
						const quote_to = replyElement ? replyElement.parentElement.parentElement.querySelector('a[href*="/status/"]').href : null

						const is_polling = !!tweetElement.querySelector('[data-testid="card.wrapper"]')
						const is_thread = !!Array.from(tweetElement.querySelectorAll('span')).find(e => e.textContent == 'Show this thread')

						return {
							screenname, username, datetime, url, tweetText, 
							source_domain, source_title, source_snippet, 
							replies_count, retweets_count, likes_count, views_count,
							reply_to, quote_to, is_polling, is_thread
						}
					}
					catch (e) {
						return undefined
					}
				}).filter(e => !!e)
			);
		}
		
		// if (elements.at(-1).textContent.trim() == '') clearInterval(i)
	} , 3000);
}
