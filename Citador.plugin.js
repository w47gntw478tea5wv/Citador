//META{"name":"Citador"}*//

/*@cc_on
@if (@_jscript)
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("J\u00E1 instalado", 0, "J\u00E1 instalado", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("Pasta n\u00E3o encontrada.", 0, "N\u00E3o foi poss\u00EDvel instalar", 0x10);
	} else {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		shell.Popup("Instalado", 0, "Instalado", 0x40);
	}
    WScript.Quit();
@else @*/

class Citador {
	constructor() {
		this.locals = {
			'pt-BR': {
				description: "Cita alguém no chat",
				startMsg: "Iniciado",
				quoteTooltip: "Citar",
				deleteTooltip: "Excluir",
				noPermTooltip: "Sem permissão para citar",
				attachment: "Anexo"
			},
			'ru-RU': {
				description: "Котировки кто-то в чате",
				startMsg: "Начало",
				quoteTooltip: "Цитата",
				deleteTooltip: "Удалить",
				noPermTooltip: "Нет прав для цитирования",
				attachment: "Вложение"
			},
			'ja': {
				description: "誰かをチャットで引用します",
				startMsg: "起動完了",
				quoteTooltip: "引用",
				deleteTooltip: "削除",
				noPermTooltip: "引用する権限がありません",
				attachment: "添付ファイル"
			},
			'default': {
				description: "Quotes somebody in chat",
				startMsg: "Started",
				quoteTooltip: "Quote",
				deleteTooltip: "Delete",
				noPermTooltip: "No permission to quote",
				attachment: "Attachment"
			}
		};
		
		var closeImg = "https://discordapp.com/assets/14f734d6803726c94b970c3ed80c0864.svg";
			deleteMsgBtnImg = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE3LjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxNiAxNiIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTYgMTYiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8ZyBpZD0iZWRpdG9yaWFsXy1fdHJhc2hfY2FuIj4KCTxnPgoJCTxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik01LDYuNUg0djZoMVY2LjV6IE0xNC41LDJIMTBWMC41QzEwLDAuMiw5LjgsMCw5LjUsMGgtNEM1LjIsMCw1LDAuMiw1LDAuNVYySDAuNUMwLjIsMiwwLDIuMiwwLDIuNQoJCQlTMC4yLDMsMC41LDNIMXYxMmMwLDAuNiwwLjQsMSwxLDFoMTFjMC42LDAsMS0wLjQsMS0xVjNoMC41QzE0LjgsMywxNSwyLjgsMTUsMi41UzE0LjgsMiwxNC41LDJ6IE02LDFoM3YxSDZWMXogTTEzLDE0LjUKCQkJYzAsMC4zLTAuMiwwLjUtMC41LDAuNWgtMTBDMi4yLDE1LDIsMTQuOCwyLDE0LjVWM2gxMVYxNC41eiBNOCw1LjVIN3Y3aDFWNS41eiBNMTEsNi41aC0xdjZoMVY2LjV6Ii8+Cgk8L2c+CjwvZz4KPC9zdmc+Cg==";
		
		this.css = `
			@font-face {
				font-family: 'Segoe MDL2 Assets';
				src: url('https://crossorigin.me/https://nirewen.s-ul.eu/WJJ3bKJl.ttf');
			}
			.citar-btn {
				cursor: pointer;
				color: #fff !important;
				position :relative;
				top: -1px;
				margin: 0 3px 0 5px;
				text-transform: uppercase;
				font-size: 10px;
				padding: 3px 5px;
				background: rgb(10, 10, 10);
				font-family: "Segoe MDL2 Assets", "Whitney";
				border-radius: 3px;
				transition: all 200ms ease-in-out;
				-webkit-transition: all 200ms ease-in-out;
				opacity: 0.8;
			}

			.citar-btn.quoting {
				background: #43b581;
				cursor: default;
				opacity: 1 !important;
			}
			.citar-btn.cant-embed {
				background: #f04747;
				cursor: default;
				opacity: 1 !important;
			}
			.quote-close {
				opacity: .5; 
				float: right;
				width: 12px;
				height: 12px;
				background: transparent url(${closeImg}); 
				background-size: cover; 
				transition: opacity .1s ease-in-out; 
				cursor: pointer;
				margin-right: 10px;
			}
			.quote-close:hover {
				opacity: 1;
			}
			.delete-msg-btn {
				opacity: 0;
				float: right;
				width: 16px;
				height: 16px;
				background-size: 16px 16px;
				background-image: url(${deleteMsgBtnImg});
				cursor: pointer;
				transition: opacity 200ms ease-in-out;
				-webkit-transition: opacity 200ms ease-in-out;
			}
			.delete-msg-btn:hover {
				opacity: 1 !important;
			}`;
		
		this.getInternalInstance = e => e[Object.keys(e).find(k => k.startsWith("__reactInternalInstance"))];
		this.getOwnerInstance = (e, {include, exclude=["Popout", "Tooltip", "Scroller", "BackgroundFlash"]} = {}) => {
			if (e === undefined) {
				return undefined;
			}
			const excluding = include === undefined;
			const filter = excluding ? exclude : include;
			function getDisplayName(owner) {
				const type = owner._currentElement.type;
				const constructor = owner._instance && owner._instance.constructor;
				return type.displayName || constructor && constructor.displayName || null;
			}
			function classFilter(owner) {
				const name = getDisplayName(owner);
				return (name !== null && !!(filter.includes(name) ^ excluding));
			}

			for (let prev, curr = this.getInternalInstance(e); !_.isNil(curr); prev = curr, curr = curr._hostParent) {
				if (prev !== undefined && !_.isNil(curr._renderedChildren)) {
					let owner = Object.values(curr._renderedChildren)
						.find(v => !_.isNil(v._instance) && v.getHostNode() === prev.getHostNode());
					if (!_.isNil(owner) && classFilter(owner)) {
						return owner._instance;
					}
				}

				if (_.isNil(curr._currentElement)) {
					continue;
				}
				let owner = curr._currentElement._owner;
				if (!_.isNil(owner) && classFilter(owner)) {
					return owner._instance;
				}
			}

			return null;
		};
	}
	
	log(message, method) {
		switch (method) {
			case "warn":
				console.warn  ( `[${this.getName()}]`, message );
				break;
			case "error":
				console.error ( `[${this.getName()}]`, message );
				break;
			case "debug":
				console.debug ( `[${this.getName()}]`, message );
				break;
			case "info":
				console.info  ( `[${this.getName()}]`, message );
				break;
			default:
				console.log   ( `[${this.getName()}]`, message );
				break;
		}
	}
	
	cancelQuote() {
		$('.quote-msg').slideUp(150, () => { $('.quote-msg').remove() });
		$('.tooltip.citador').remove();
			
		this.quoteMsg   = null;
			
		this.quoteProps.messages.forEach(m => m.deleted = null);
		this.quoteProps = null;
	}
	
	start() {
		$('body').append('<iframe class="citador-token-grabber">');
		var self = this;
		BdApi.injectCSS("citador-css", this.css);
		
		$(document).on("mouseover.citador", function(e) {
			var target = $(e.target);
			if (target.parents(".message").length > 0) {
				var todasMensagens = $('.messages .message-group'),
					nomeData       = $('.messages .message-group .comment .body h2'),
					citarBtn       = '<span class="citar-btn"></span>',
					closeBtn       = '<div class="quote-close"></div>',
					deleteMsgBtn   = '<div class="delete-msg-btn"></div>',
					quoteTooltip   = $("<div>").append(self.getLocal().quoteTooltip).addClass("tooltip tooltip-top tooltip-black citador"),
					deleteTooltip  = $("<div>").append(self.getLocal().deleteTooltip).addClass("tooltip tooltip-top tooltip-black citador"),
					noPermTooltip  = $("<div>").append(self.getLocal().noPermTooltip).addClass("tooltip tooltip-top tooltip-red citador");
				
				todasMensagens
				.on('mouseover', function() {
					if ($(this).find('.citar-btn').length == 0) {
						todasMensagens.hasClass('compact') ? $(this).find('.timestamp').first().prepend(citarBtn) : $(this).find(nomeData).append(citarBtn);
						$(this).find('.citar-btn')
							.on('mousedown.citador', function() {return false;})
							.on('mouseover.citador', function() {
								$(".tooltips").append(quoteTooltip);
								var position = $(this).offset();
								position.top -= 40;
								position.left += $(this).width()/2 - quoteTooltip.width()/2 - 7;
								quoteTooltip.offset(position);
								$(this).on("mouseout.citador", function () {
									$(this).off("mouseout.citador");
									quoteTooltip.remove();
								});
							})
							.click(function() {
								self.attachParser();
								
								var message  = $(this).parents('.message-group'),
									mInstance = self.getOwnerInstance($(".messages")[0]),
									channel = mInstance.props.channel,
									text,
									range;
								
								self.quoteProps = $.extend(true, {}, self.getOwnerInstance(message[0]).props);
									
								// TODO: FIX THAT SHIT
								/*if (window.getSelection && window.getSelection().rangeCount > 0) {
									range = window.getSelection().getRangeAt(0);
								} else if (document.selection && document.selection.type !== 'Control') {
									range = document.selection.createRange();
								}*/
								var thisPost = $(this).closest('.comment');
								
								this.createQuote = function() {
									var messageElem = $(message).clone().hide().appendTo(".quote-msg");
									self.quoteMsg = $(".quote-msg");
									
									$('.quote-msg').find('.citar-btn').toggleClass('quoting');
									$('.quote-msg').find('.citar-btn').text('');
									
									$('.quote-msg').find('.embed').each(function() {
										$(this).closest('.accessory').remove();
									});
									
									$('.quote-msg').find('.markup').each(function() {
										if ($(this).text() == "" && $(this).closest(".message").find('.accessory').length == 0) {
											$(this).closest('.message-text').remove();
										}
									});
									$('.quote-msg').find('.message-content').each(function() {
										if ($(this).text() == "" && $(this).closest(".message").find('.accessory').length == 0) {
											$(this).closest('.message-text').remove();
										}
									});

									$('.quote-msg').find('.markup').before(deleteMsgBtn);
									$('.quote-msg').find('.edited, .btn-option, .btn-reaction').remove();
									
									$('.quote-msg .message-group').append(closeBtn);
									$('.quote-msg').find('.quote-close').click(function() {
										self.cancelQuote();
									});
									
									// define a função de clique, pra deletar uma mensagem que você não deseja citar
									$('.quote-msg').find('.delete-msg-btn')
										.click(function() {
											var deleteMsg = $('.quote-msg').find('.message').has(this),
												deleteI   = $('.quote-msg').find('.message').index(deleteMsg);
											
											deleteMsg.find('.message-text, .accessory').hide();
											deleteTooltip.remove();
											
											self.quoteProps.messages[deleteI].deleted = true;
											if (self.quoteProps.messages.filter(m => !m.deleted).length < 1) {
												self.cancelQuote();
											}
										})
										.on('mouseover.citador', function() {
											$(".tooltips").append(deleteTooltip);
											var position = $(this).offset();
											position.top -= 40;
											position.left += $(this).width()/2 - deleteTooltip.width()/2 - 13;
											deleteTooltip.offset(position);
											$(this).on("mouseout.citador", function () {
												$(this).off("mouseout.citador");
												deleteTooltip.remove();
											});
										});
									
									$('.channel-text-area-default textarea').focus();

									// TODO: FIX THAT SHIT
									/*if (range) {
										console.log(range)
										var startPost = $(range.startContainer).closest('.comment'),
											endPost   = $(range.endContainer).closest('.comment');
											
										if (startPost.is(endPost) && startPost.is(thisPost) && startPost.length && endPost.length) {
											text = range.toString().trim();
											$('.quote-msg').find(".markup, .accessory, .message:not(.first)").remove();
											$('.quote-msg').find(".message.first").find(".message-text").append('<div class="markup">' + text + '</div>');
										}
									}*/

									$('.quote-msg').find(".message")
										.on('mouseover.citador', function() {
											$(this).find('.delete-msg-btn').fadeTo(5, 0.4);
										})
										.on('mouseout.citador', function() {
											$(this).find('.delete-msg-btn').fadeTo(5, 0);
										});

									var canEmbed = channel.isPrivate() || mInstance.can(0x4800, {channelId: channel.id});
									if (!canEmbed) {
										$('.quote-msg').find('.citar-btn:not(.quoting).cant-embed').toggleClass('quoting', 'cant-embed');
										$('.quote-msg').find('.citar-btn:not(.cant-embed)').toggleClass('cant-embed');
										$('.quote-msg').find('.citar-btn').text("");
										$('.quote-msg').find('.citar-btn')
											.on('mouseover.citador', function() {
												if ($(this).hasClass('cant-embed')) {
													$(".tooltips").append(noPermTooltip);
													var position = $(this).offset();
													position.top -= 40;
													position.left += $(this).width()/2 - noPermTooltip.width()/2 - 7;
													noPermTooltip.offset(position);
													$(this).on("mouseout.citador", function () {
														$(this).off("mouseout.citador");
														noPermTooltip.remove();
													});
												}
											});
									}
									
									messageElem.slideDown(150);
								};
								
								if ($('.quote-msg .message-group').length > 0) {
									$('.quote-msg .message-group').remove();
								} else {
									$('.channel-text-area-default').prepend('<div class="quote-msg"></div>');
								}
								
								this.createQuote();
							});
					}
				})
				.on('mouseleave',function() {
					if ($(this).find('.citar-btn').length == 1) {
						$(this).find('.citar-btn').empty().remove();
					}
				});
			}
		});
		this.log(this.getLocal().startMsg, "info");
	}
	
	attachParser() {
		var el   = $('.channel-text-area-default textarea'),
			self = this;
			
		if (el.length == 0) return;
		
		this.handleKeypress = function(e) {
			var code = e.keyCode || e.which;
			if (code !== 13) return;
			try {
				var props = self.quoteProps;
				console.log(props)
				if (props) {
					if (e.shiftKey || $('.channel-textarea-autocomplete-inner').length >= 1) return;
		
					var messages  = props.messages.filter(m => !m.deleted),
						guilds    = self.getOwnerInstance($(".guilds.scroller")[0]).state.guilds.map(o => o.guild),
						msg		  = props.messages[0],
						cc        = self.getOwnerInstance($("form")[0]).props.channel,
						msgC      = props.channel,
						msgG      = guilds.filter(g => g.id == msgC.guild_id)[0],
						
						author    = msg.author,
						color     = Number(`0x${msg.colorString.slice(1)}`),
						oldText   = $('.channel-text-area-default textarea').val(),
						text      = messages.map(m => m.content).join('\n'),
						atServer  = msgC.guild_id != cc.guild_id ? ` at ${msgG.name}` : '',
						chName    = msgC.isPrivate() ? `@${msgC._getUsers()[0].username}` : `#${msgC.name}`;
					
					// os dados do embed 
					var data = {
							content: oldText,
							embed: {
								author: {
									name: msg.nick || author.username,
									icon_url: author.getAvatarURL()
								},
								description: text,
								footer: {
									text: `in ${chName}${atServer}`
								},
								color: color,
								timestamp: msg.timestamp.toISOString()
							}
						};

					
					var attachments = messages.map(m => m.attachments).reduce((a, b) => a.concat(b));
					console.log(attachments);
					if (attachments.length >= 1) {
						// checar se tem alguma imagem na mensagem citada, e adicionar ao embed final
						var imgAt = attachments.filter(a => a.width);
						if(imgAt.length >= 1) {
							data.embed.image = {url: attachments[0].url};
						}
						
						// checar se tem algum arquivo na mensagem citada, e adicionar ao embed final
						var otherAt = attachments.filter(a => !a.width);
						if(otherAt.length >= 1) {
							data.embed.fields = [];
							otherAt.forEach((at, i) => {
								var emoji = '📁';
								if (/(.apk|.appx|.pkg|.deb)$/.test(at.filename)) emoji = '📦';
								if (/(.jpg|.png|.gif)$/.test(at.filename)) emoji = '🖼';
								if (/(.zip|.rar|.tar.gz)$/.test(at.filename)) emoji = '📚';
								if (/(.txt)$/.test(at.filename)) emoji = '📄';
								
								data.embed.fields.push({name: `${self.getLocal().attachment} #${i+1}`, value: `${emoji} [${at.filename}](${at.url})`});
							});
						}
					}
					
					// post do quote final
					$.ajax({
						type : "POST",
						url : `https://discordapp.com/api/channels/${cc.id}/messages`,
						headers : {
							"Authorization": $('body').find('.citador-token-grabber')[0].contentWindow.localStorage.token.split('"')[1]
						},
						dataType : "json",
						contentType : "application/json",
						data: JSON.stringify(data),
						error: (req) => {
							self.log(req.responseText, "error");
						}
					});
					$(this).val("").focus()[0].dispatchEvent(new Event('input', { bubbles: true }));
					
					self.cancelQuote();
					e.preventDefault();
					e.stopPropagation();
					return;
				}
			} 
			catch (e) {
				self.log(e, "warn");
			}
		};
		el[0].addEventListener("keydown", this.handleKeypress, false);
		el[0].addEventListener("keyup", function(e) {
			if (e.keyCode == 27 && self.quoteProps) {
				self.cancelQuote();
			}
		}, false);
	}
	
	deleteEverything() {
		$(document).off("mouseover.citador");
		$('.messages .message-group').off('mouseover');
		$('.messages .message-group').off('mouseleave');
		BdApi.clearCSS("citador-css");
		$('.citador-token-grabber').remove();
	}
	
	getLocal() {
		return this.locals[navigator.language] || this.locals["default"]
	}
	
	getName         () { return "Citador";                  }
	getDescription  () { return this.getLocal().description }
	getVersion      () { return "1.5.8";                    }
	getAuthor       () { return "Nirewen";             		}
	getSettingsPanel() { return "";                    		}
	load            () {                               		}
	unload          () { this.deleteEverything();      		}
	stop            () { this.deleteEverything();      		}
	
	onSwitch() {
		this.attachParser();
		if (this.quoteProps) {
			var channel       = this.getOwnerInstance($(".messages")[0], {include:["Channel"]}),
				canEmbed      = channel.state.channel.isPrivate() || channel.can(0x4800, {channelId: channel.state.channel.id}),
				noPermTooltip = $("<div>").append(this.getLocal().noPermTooltip).addClass("tooltip tooltip-top tooltip-red citador");
			
			if (!canEmbed) {
				$('.quote-msg').find('.citar-btn:not(.quoting).cant-embed').toggleClass('quoting', 'cant-embed');
				$('.quote-msg').find('.citar-btn:not(.cant-embed)').toggleClass('cant-embed');
				$('.quote-msg').find('.citar-btn').text("");
				$('.quote-msg').find('.citar-btn')
					.on('mouseover.citador', function() {
						if ($(this).hasClass('cant-embed')) {
							$(".tooltips").append(noPermTooltip);
							var position = $(this).offset();
							position.top -= 40;
							position.left += $(this).width()/2 - noPermTooltip.width()/2 - 7;
							noPermTooltip.offset(position);
							$(this).on("mouseout.citador", function () {
								$(this).off("mouseout.citador");
								noPermTooltip.remove();
							});
						}
					});
			} else {
				$('.quote-msg').find('.citar-btn:not(.quoting)').toggleClass('quoting');
				$('.quote-msg').find('.citar-btn.cant-embed').toggleClass('cant-embed');
				$('.quote-msg').find('.citar-btn').text("");
			}
			$('.channel-text-area-default').prepend(this.quoteMsg);
		}
	}
}

/*@end @*/
