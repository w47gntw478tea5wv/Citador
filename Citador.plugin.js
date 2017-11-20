//META{"name":"Citador"}*//

class Citador {
	get local() {
		switch (document.documentElement.getAttribute('lang').split('-')[0]) {
			case 'pt':
				return {
					description: "Cita alguém no chat",
					startMsg: "Iniciado",
					quoteTooltip: "Citar",
					deleteTooltip: "Excluir",
					noPermTooltip: "Sem permissão para citar",
					attachment: "Anexo"
				};
			case 'de': 
				return {
					description: "Zitiert jemanden im Chat",
					startMsg: "Gestartet",
					quoteTooltip: "Zitieren",
					deleteTooltip: "Löschen",
					noPermTooltip: "Keine Rechte, zu zitieren",
					attachment: "Anhang"
				};
			case 'ru': 
				return {
					description: "Позволяет цитировать сообщения",
					startMsg: "Запущен",
					quoteTooltip: "Цитировать",
					deleteTooltip: "Удалить",
					noPermTooltip: "Нет прав для цитирования",
					attachment: "Вложение"
					};
			case 'ja': 
				return {
					description: "誰かをチャットで引用します",
					startMsg: "起動完了",
					quoteTooltip: "引用",
					deleteTooltip: "削除",
					noPermTooltip: "引用する権限がありません",
					attachment: "添付ファイル"
				};
			default: 
				return {
					description: "Quotes somebody in chat",
					startMsg: "Started",
					quoteTooltip: "Quote",
					deleteTooltip: "Delete",
					noPermTooltip: "No permission to quote",
					attachment: "Attachment"
				};
		};
	}
	
	start() {
		let libraryScript = this.inject('script', {
			type: 'text/javascript',
			id: 'zeresLibraryScript',
			src: 'https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js'
		});
		this.inject('link', {
			type: 'text/css',
			id: 'citador-css',
			rel: 'stylesheet',
			href: 'https://rawgit.com/nirewen/Citador/quote-btn/Citador.styles.css'
		});

		if (typeof window.ZeresLibrary !== "undefined") 
			this.initialize();
		else 
			libraryScript.addEventListener("load", () => { this.initialize(); });
	}
	
	initialize() {
		let self = this;
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/nirewen/Citador/pt/Citador.plugin.js");
		PluginUtilities.showToast(`${this.getName()} ${this.getVersion()} ${this.local.startMsg.toLowerCase()}`);
		this.switchObserver    = PluginUtilities.createSwitchObserver(this);
		this.MessageParser     = PluginUtilities.WebpackModules.findByUniqueProperties(["createBotMessage"]);
		this.MessageQueue      = PluginUtilities.WebpackModules.findByUniqueProperties(["enqueue"]);
		this.MessageController = PluginUtilities.WebpackModules.findByUniqueProperties(["sendClydeError"]);
		this.EventDispatcher   = PluginUtilities.WebpackModules.findByUniqueProperties(["dispatch"]);
		this.MainDiscord       = PluginUtilities.WebpackModules.findByUniqueProperties(["ActionTypes"]);
		this.HistoryUtils      = PluginUtilities.WebpackModules.findByUniqueProperties(['transitionTo', 'replaceWith', 'getHistory']);
		this.moment            = PluginUtilities.WebpackModules.findByUniqueProperties(['parseZone']);
	
		this.patchExternalLinks();
		
		$(document).on("mouseover.citador", function(e) {
			var target = $(e.target);
			if (target.parents(".message").length > 0) {
				$('.messages .message-group')
					.on('mouseover', function() {
						if ($(this).find('.citar-btn').length == 0) {
							$('.messages .message-group').hasClass('compact') 
								? $(this).find('.timestamp').first().prepend('<span class="citar-btn"></span>') 
								: $(this).find($('.messages .message-group .comment .body h2')).append('<span class="citar-btn"></span>');
								
							new PluginTooltip.Tooltip($(this).find('.citar-btn'), self.local.quoteTooltip);
							$(this).find('.citar-btn')
								.on('mousedown.citador', function() {return false})
								.click(function() {
									self.attachParser();
									
									let message   = $(this).parents('.message-group'),
										mInstance = ReactUtilities.getOwnerInstance($(".messages-wrapper")[0]),
										channel   = mInstance.props.channel,
										range;
									
									self.quoteProps = $.extend(true, {}, ReactUtilities.getOwnerInstance(message[0]).props);
										
									if (window.getSelection && window.getSelection().rangeCount > 0)
										range = window.getSelection().getRangeAt(0);
									else if (document.selection && document.selection.type !== 'Control')
										range = document.selection.createRange();
										
									var thisPost = $(this).closest('.comment');
									
									this.createQuote = function() {
										var messageElem = $(message).clone().hide().appendTo(".quote-msg");
										self.quoteMsg = $(".quote-msg");
										
										$('.quote-msg').find('.citar-btn').toggleClass('hidden');
										
										$('.quote-msg').find('.embed').each(function() {
											$(this).closest('.accessory').remove();
										});
										
										$('.quote-msg').find('.markup').each(function() {
											if (0 === $(this).text().length + $(this).children().length + $(this).closest(".message").find('.accessory').length) {
												$(this).closest('.message-text').remove();
											}
										});
										$('.quote-msg').find('.message-content').each(function() {
											if (0 === $(this).text().length + $(this).children().length + $(this).closest(".message").find('.accessory').length) {
												$(this).closest('.message-text').remove();
											}
										});

										$('.quote-msg').find('.markup').before('<div class="delete-msg-btn"></div>');
										$('.quote-msg').find('.edited, .btn-option, .btn-reaction').remove();
										
										$('.quote-msg .message-group').append('<div class="quote-close"></div>');
										$('.quote-msg').find('.quote-close').click(function() {
											self.cancelQuote();
										});
										
										// define a função de clique, pra deletar uma mensagem que você não deseja citar
										$('.quote-msg').find('.delete-msg-btn')
											.click(function() {
												self.removeQuoteAtIndex($('.quote-msg .message').index($('.quote-msg .message').has(this)), () => deleteTooltip.remove());
											})
											.each(function() {
												new PluginTooltip.Tooltip($(this), self.local.deleteTooltip);
											});

										if (range) {
											var startPost = $(range.startContainer).closest('.message'),
												endPost   = $(range.endContainer).closest('.message');
												
											if (thisPost.has(startPost) && thisPost.has(endPost) && startPost.length && endPost.length) {
												var startI   = thisPost.find(".message").index(startPost),
													endI     = thisPost.find(".message").index(endPost);
												
												if(range.startOffset != range.endOffset || startI != endI) {
													self.selectionP = {
														start: {
															index: startI,
															offset: range.startOffset
														},
														end: {
															index: endI,
															offset: range.endOffset
														}
													};
												
													self.quoteProps.messages.forEach((m, i) => {
														var msg = $($('.quote-msg .message')[i]).find(".markup");
														if(endI == startI) msg.text(m.content.substring(range.startOffset, range.endOffset));
														else if(i == startI) msg.text(m.content.substring(range.startOffset));
														else if(i == endI) msg.text(m.content.substring(0, range.endOffset));
														if(i < startI || i > endI) self.removeQuoteAtIndex(i);
													});
												}
											}
										}

										$('.quote-msg').find(".message")
											.on('mouseover.citador', function() {
												$(this).find('.delete-msg-btn').fadeTo(5, 0.4);
											})
											.on('mouseout.citador', function() {
												$(this).find('.delete-msg-btn').fadeTo(5, 0);
											});

										if (!self.canEmbed()) {
											$('.quote-msg').find('.citar-btn.hidden:not(.cant-embed)').toggleClass('hidden cant-embed');
											new PluginTooltip.Tooltip($('.quote-msg').find('.citar-btn'), self.local.noPermTooltip, 'red');
										}
										
										messageElem.slideDown(150);
									};
									
									if ($('.quote-msg .message-group').length > 0)
										$('.quote-msg .message-group').remove();
									else
										$('.channelTextArea-1HTP3C').prepend('<div class="quote-msg"></div>');
									
									this.createQuote();
									$('.channelTextArea-1HTP3C').focus();
								});
						}
					})
					.on('mouseleave',function() {
						if ($(this).find('.citar-btn').length == 1)
							$(this).find('.citar-btn').empty().remove();
					});
			}
		});
		this.log(this.local.startMsg, "info");
	}
	
	canEmbed() {
		const channel = ReactUtilities.getOwnerInstance($(".messages-wrapper")[0]);
		return channel.props.channel.isPrivate() || channel.can(0x4800, {channelId: channel.props.channel.id});
	}
	
	attachParser() {
		var el   = $('.channelTextArea-1HTP3C');
		if (el.length == 0) return;
		
		const handleKeypress = (e) => {
			var code = e.keyCode || e.which;
			if (code !== 13) return;
			
			try {
				if (this.canEmbed())
					this.sendEmbedQuote(e);
				else
					this.sendTextQuote(e);
			} catch (e) {
				this.log(e, "warn");
			}
		};
		
		el[0].addEventListener("keydown", handleKeypress, false);
		el[0].addEventListener("keyup", (e) => {
			if (e.keyCode == 27 && this.quoteProps) this.cancelQuote();
		}, false);
	}
	
	sendEmbedQuote(e) {
		var props = this.quoteProps;
		if (props) {
			if (e.shiftKey || $('.autocomplete-1TnWNR').length >= 1) return;
		
			var messages  = props.messages.filter(m => !m.deleted),
				guilds    = this.guilds,
				msg		  = props.messages[0],
				cc        = ReactUtilities.getOwnerInstance($("form")[0]).props.channel,
				msgC      = props.channel,
				msgG      = guilds.filter(g => g.id == msgC.guild_id)[0],
				
				author    = msg.author,
				avatarURL = author.getAvatarURL(),
				color     = parseInt(msg.colorString ? msg.colorString.slice(1) : 'ffffff', 16),
				msgCnt    = this.MessageParser.parse(cc, $('.channelTextArea-1HTP3C textarea').val()),
				text      = messages.map(m => m.content).join('\n'),
				atServer  = msgC.guild_id && msgC.guild_id != cc.guild_id ? ` at ${msgG.name}` : '',
				chName    = msgC.isDM() ? `@${msgC._getUsers()[0].username}` : msgC.isGroupDM() ? `${msgC.name}` : `#${msgC.name}`;
					
			if (this.selectionP) {
				var start = this.selectionP.start,
					end = this.selectionP.end;
				
				props.messages.forEach((m, i) => {
					text = '';
					if(!m.deleted) {
						var endText = m.content;
						if(end.index == start.index) endText = m.content.substring(start.offset, end.offset);
						else if(i == start.index) endText = m.content.substring(start.offset);
						else if(i == end.index) endText = m.content.substring(0, end.offset);
						if(i >= start.index && i <= end.index) text += `${endText}\n`;
					}
				});
			}
			// os dados do embed 
			let embed = {
					author: {
						name: msg.nick || author.username,
						icon_url: avatarURL.startsWith("https://") ? avatarURL : `https://discordapp.com/${avatarURL}`
					},
					url: `${this.quoteURL}${msgG ? `guild_id=${msgG.id}&` : ''}channel_id=${msgC.id}&message_id=${msg.id}`,
					description: text,
					footer: {
						text: `in ${chName}${atServer}`
					},
					color,
					timestamp: msg.timestamp.toISOString()
				},
				attachments = messages.map(m => m.attachments).reduce((a, b) => a.concat(b));
						
			if (attachments.length >= 1) {
				// checar se tem alguma imagem na mensagem citada, e adicionar ao embed final
				var imgAt = attachments.filter(a => a.width);
				if(imgAt.length >= 1)
					embed.image = {url: attachments[0].url};
				
				// checar se tem algum arquivo na mensagem citada, e adicionar ao embed final
				var otherAt = attachments.filter(a => !a.width);
				if (otherAt.length >= 1) {
					embed.fields = [];
					otherAt.forEach((at, i) => {
						var emoji = '📁';
						if (/(.apk|.appx|.pkg|.deb)$/.test(at.filename)) emoji = '📦';
						if (/(.jpg|.png|.gif)$/.test(at.filename)) emoji = '🖼';
						if (/(.zip|.rar|.tar.gz)$/.test(at.filename)) emoji = '📚';
						if (/(.txt)$/.test(at.filename)) emoji = '📄';
						
						embed.fields.push({name: `${this.local.attachment} #${i+1}`, value: `${emoji} [${at.filename}](${at.url})`});
					});
				}
			}
					
			// cria uma mensagem com o conteúdo desejado (é necessário pra validar um "id")
			var msg = this.MessageParser.createMessage(cc.id, msgCnt.content);
				
			// adiciona a mensagem a lista de mensagens que serão enviadas
			this.MessageQueue.enqueue({
				type: "send",
				message: {
					channelId: cc.id,
					content: msgCnt.content,
					tts: false,
					nonce: msg.id,
					embed
				}
			}, function(r) {
				r.ok ? (this.MessageController.receiveMessage(cc.id, r.body)) : (r.status >= 400 && r.status < 500 && r.body && this.MessageController.sendClydeError(cc.id, r.body.code),
				this.EventDispatcher.dispatch({
					type: this.MainDiscord.ActionTypes.MESSAGE_SEND_FAILED,
					messageId: msg.id,
					channelId: cc.id
				}))
			});
					
			ReactUtilities.getOwnerInstance($('form')[0]).setState({textValue: ''});
		
			this.cancelQuote();
			e.preventDefault();
			e.stopPropagation();
			return;
		}
	}
	
	sendTextQuote(e) {
		var props = this.quoteProps;
		if (props) {
			if (e.shiftKey || $('.autocomplete-1TnWNR').length >= 1) return;
		
			var messages  = props.messages.filter(m => !m.deleted),
				guilds    = this.guilds,
				msg		  = props.messages[0],
				cc        = ReactUtilities.getOwnerInstance($("form")[0]).props.channel,
				msgC      = props.channel,
				msgG      = guilds.filter(g => g.id == msgC.guild_id)[0],
				
				author    = msg.author,
				avatarURL = author.getAvatarURL(),
				color     = parseInt(msg.colorString ? msg.colorString.slice(1) : 'ffffff', 16),
				content   = this.MessageParser.parse(cc, $('.channelTextArea-1HTP3C textarea').val()).content,
				text      = messages.map(m => m.content).join('\n'),
				atServer  = msgC.guild_id && msgC.guild_id != cc.guild_id ? ` at ${msgG.name}` : '',
				chName    = msgC.isDM() ? `@${msgC._getUsers()[0].username}` : msgC.isGroupDM() ? `${msgC.name}` : `#${msgC.name}`;
					
			if (this.selectionP) {
				var start = this.selectionP.start,
					end = this.selectionP.end;
				
				props.messages.forEach((m, i) => {
					text = '';
					if(!m.deleted) {
						var endText = m.content;
						if(end.index == start.index) endText = m.content.substring(start.offset, end.offset);
						else if(i == start.index) endText = m.content.substring(start.offset);
						else if(i == end.index) endText = m.content.substring(0, end.offset);
						if(i >= start.index && i <= end.index) text += `${endText}\n`;
					}
				});
			}
			
			const format = 'DD-MM-YYYY HH:mm';
			content     += `\n${'```'}\n${this.MessageParser.unparse(text, cc.id).replace(/\n?(```((\w+)?\n)?)+/g, '\n').trim()}\n${'```'}`;
			content     += `\`${msg.nick || author.username} - ${this.moment(msg.timestamp).format(format)} | ${chName}${atServer}\``;
			content      = content.trim();
					
			this.MessageController.sendMessage(cc.id, { content });
					
			ReactUtilities.getOwnerInstance($('form')[0]).setState({textValue: ''});
		
			this.cancelQuote();
			e.preventDefault();
			e.stopPropagation();
			return;
		}
	}
	
	patchExternalLinks() {
		const self = this,
			ExternalLink = PluginUtilities.WebpackModules.find(a => a.prototype && a.prototype.onClick).prototype;
		ExternalLink.oldOnClick = ExternalLink.onClick;
		ExternalLink.onClick = function(e) {
			const t = this.props;
			if (t.href.startsWith(self.quoteURL)) {
				e.preventDefault();
				const querystring = require('querystring');
				const {guild_id, channel_id, message_id} = querystring.parse(t.href.substring(self.quoteURL.length));
				if (!guild_id || self.guilds.find(g => g.id == guild_id))
					self.HistoryUtils.transitionTo(self.MainDiscord.Routes.MESSAGE(guild_id, channel_id, message_id));
				else
					ReactUtilities.getOwnerInstance($('.app')[0]).shake();
			} else 
				this.oldOnClick(e);
		}
	}
	
	constructor() {
		this.quoteURL = 'https://github.com/nirewen/Citador?';
		this.log = (message, method = 'log') => console[method](`[${this.getName()}]`, message);
		this.inject = (name, options) => {
			let element = document.getElementById(options.id);
			if (element) element.parentElement.removeChild(element);
			element = document.createElement(name);
			for (let attr in options)
				element.setAttribute(attr, options[attr]);
			document.head.appendChild(element);
			return element;
		};
		this.remove = (element) => $(element).remove();
	}
	
	removeQuoteAtIndex(i) {
		if (this.quoteProps) {
			if (this.quoteProps.messages.filter(m => !m.deleted).length < 2)
				this.cancelQuote();
			else {
				let deleteMsg = $($('.quote-msg .message')[i]);								
				deleteMsg.find('.message-text, .accessory').hide();		
				this.quoteProps.messages[i].deleted = true;
			}
		} else
			this.cancelQuote();
	}
	
	cancelQuote() {
		$('.quote-msg').slideUp(300, () => $('.quote-msg').remove());
		this.quoteMsg   = null;
		this.quoteProps.messages.forEach(m => m.deleted = null);
		this.quoteProps = null;
		this.selectionP = null;
	}
	
	deleteEverything() {
		$(document).off("mouseover.citador");
		$('.messages .message-group').off('mouseover');
		$('.messages .message-group').off('mouseleave');
		this.remove("#citador-css");
		this.switchObserver.disconnect();
	}
	get guilds      () { return ReactUtilities.getOwnerInstance($(".guilds-wrapper")[0]).state.guilds.map(o => o.guild)}
	getName         () { return "Citador";            }
	getDescription  () { return this.local.description}
	getVersion      () { return "1.6.7";              }
	getAuthor       () { return "Nirewen";            }
	getSettingsPanel() { return "";                   }
	unload          () { this.deleteEverything();     }
	stop            () { this.deleteEverything();     }
	load            () {                              }
	onChannelSwitch () {
		if (this.quoteProps) {
			this.attachParser();
			
			$('.channelTextArea-1HTP3C').prepend(this.quoteMsg);
			
			if (!this.canEmbed()) {
				$('.quote-msg').find('.citar-btn.hidden:not(.cant-embed)').toggleClass('hidden cant-embed');
				new PluginTooltip.Tooltip($('.quote-msg').find('.citar-btn'), this.local.noPermTooltip, 'red');
			} else
				$('.quote-msg').find('.citar-btn:not(.hidden).cant-embed').toggleClass('hidden cant-embed');
		}
	}
}