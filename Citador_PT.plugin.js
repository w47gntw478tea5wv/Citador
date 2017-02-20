//META{"name":"Citador"}*//

const token = "COLOQUE SEU TOKEN AQUI";

var isQuote = false,
	quoting = false,
	elem,
	chanName,
	serverName,
	atServerName;

class Citador {
	constructor() {
		this.defaultToken = "COLOQUE SEU TOKEN AQUI"; // NÃO MUDE ISSO!
		this.startMsg = "Iniciado";
		this.tokenLink = "https://github.com/nirewen/Citador/tree/pt#adquirindo-token";
		this.notSetToken = `Seu token não está definido. Por favor, siga os passos para a definição do token.<br/><a href='${this.tokenLink}' target='_blank'>Guia do Citador: Como definir seu token</a>.`;
		this.invalidToken = ['Seu token é inválido. Por favor, cheque-o de novo.', '✖ Token inválido'];
		this.validToken = '✔ Token válido';
		this.quotingMsg = " CITANDO";
		this.quoteTooltip = "Citar";
		this.deleteTooltip = "Excluir";
		this.closeImg = "https://discordapp.com/assets/14f734d6803726c94b970c3ed80c0864.svg";
		this.deleteMsgBtnImg = "https://imgh.us/deleteMsgBtnImgHover.svg";
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
				margin-left: 5px;
				text-transform: uppercase;
				font-size: 10px;
				padding: 3px 5px;
				background: rgba(0,0,0,0.4);
				font-family: "Segoe MDL2 Assets", "Whitney";
				border-radius: 3px;
				transition: all 200ms ease-in-out;
				-webkit-transition: all 200ms ease-in-out;
			}
			.citar-btn.quoting {
				background: rgba(114, 137, 218, .8);
				cursor: default;
			}
			.quote-close {
				opacity: .5; 
				float: right;
				width: 12px;
				height: 12px;
				background: transparent url(${this.closeImg}); 
				background-size: cover; 
				transition: opacity .1s ease-in-out; 
				cursor: pointer;
				margin-right: 10px;
			}
			.quote-close:hover {
				opacity: 1;
			}
			.delete-msg-btn {
				opacity: .4;
				float: right;
				width: 16px;
				height: 16px;
				background-size: 16px 16px;
				background-image: url(${this.deleteMsgBtnImg});
				cursor: pointer;
				transition: opacity 200ms ease-in-out;
				-webkit-transition: opacity 200ms ease-in-out;
			}
			.delete-msg-btn:hover {
				opacity: 1;
			}`;
		this.componentToHex = (c) => {
			var hex = Number(c).toString(16);
			return hex.length == 1 ? "0" + hex : hex;
		};
		this.rgbToHex = (r, g, b) => {
			return this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
		};
		this.cancelQuote = () => {
			$('.quote-msg').slideUp(150, () => { $('.quote-msg').remove() });
			$('.tooltip.citador').remove();
			isQuote      = false; 
			quoting      = false;
			atServerName = '';
		};
		this.log = (message, method) => {
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
		};
	}
	start() {
		var self = this;
		if (token == "" || token == this.defaultToken) {
			this.stop();
			return BdApi.getCore().alert(this.getName(), this.notSetToken);
		}
		$.ajax({
			type : "GET",
			url : `https://discordapp.com/api/guilds/` + $('.guilds .guild-inner:eq(2)').find('a').attr('href').split('/').pop(),
			headers : {
				"Authorization": token
			},
			success: () => {
				this.log(self.validToken, "debug");
			},
			error: (req) => {
				if (JSON.parse(req.responseText).message == "401: Unauthorized") {
					this.stop();
					BdApi.getCore().alert(self.getName(), self.invalidToken[0]);
					this.log(self.invalidToken[1], "error");
				} else { // in case there's no guild, the token will be also valid, isn't it?
					this.log(self.validToken, "debug");
				}
			}
		});
		this.attachParser();
		BdApi.injectCSS("citador-css", this.css);
		
		$(document).on("mouseover.citador", function(e) {
			var target = $(e.target);
			if (target.parents(".message").length > 0) {
				var todasMensagens = $('.messages .message-group'),
					nomeData       = $('.messages .message-group .comment .body h2'),
					citarBtn       = '<span class="citar-btn"></span>',
					closeBtn       = '<div class="quote-close"></div>',
					deleteMsgBtn   = '<div class="delete-msg-btn"></div>',
					quoteTooltip   = $("<div>").append(self.quoteTooltip).addClass("tooltip tooltip-top tooltip-normal citador"),
					deleteTooltip  = $("<div>").append(self.deleteTooltip).addClass("tooltip tooltip-top tooltip-normal citador");
				
				todasMensagens.on('mouseover', function() {
					if (nomeData.find('.citar-btn').length == 0) {
						$(this).find(nomeData).append(citarBtn);
						$(this).find('.citar-btn')
							.on('mousedown.citador', function() {return false;})
							.on('mouseover.citador', function() {
								$(".tooltips").append(quoteTooltip);
								var position = $(this).offset();
								position.top -= 30;
								position.left += $(this).width()/2 - quoteTooltip.width()/2 - 5;
								quoteTooltip.offset(position);
								$(this).on("mouseout.citador", function () {
									$(this).off("mouseout.citador");
									quoteTooltip.remove();
								})
							})
							.click(function() {
								isQuote      = true;
								atServerName = '';
								
								var message  = $(this).parents('.message-group'),
									text,
									range;
									
								if (window.getSelection && window.getSelection().rangeCount > 0) {
									range = window.getSelection().getRangeAt(0);
								} else if (document.selection && document.selection.type !== 'Control') {
									range = document.selection.createRange();
								}
								var thisPost = $(this).closest('.comment');
								
								this.createQuote = function() {
									$(message).clone().hide().appendTo(".quote-msg").slideDown(150);
									serverName = $('.guild-header header span').text();
									elem = $('.quote-msg');
									
									$('.quote-msg').find('.citar-btn').toggleClass('quoting');
									$('.quote-msg').find('.citar-btn').text(self.quotingMsg);
									
									$('.quote-msg').find('.embed').each(function() {
										$(this).closest('.accessory').remove();
									});
									
									$('.quote-msg').find('.markup').each(function() {
										if ($(this).text() == "" && $(this).closest(".message").find('.accessory').length == 0) {
											$(this).closest('.message-text').remove();
										}
									});

									// testar se é um canal privado ou canal de servidor
									if ($('.chat .title-wrap .title.channel-group-dm .channel-name').length >= 1) {
										chanName = $('.chat .title-wrap .channel-name').text();
									}
									if ($('.chat .title-wrap .title:not(.channel-group-dm) .channel-name.channel-private').length >= 1) { 
										chanName = "@" + $('.chat .title-wrap .channel-name').text();
									}
									if ($('.chat .title-wrap .title:not(.channel-group-dm) .channel-name:not(.channel-private)').length >= 1) {
										chanName = "#" + $('.chat .title-wrap .channel-name').text();
									}

									$('.quote-msg').find('.edited').remove();
									$('.quote-msg').find('.markup').before(deleteMsgBtn);
									$('.quote-msg').find('.btn-option').remove();
									$('.quote-msg').find('.btn-reaction').remove();
									
									$('.quote-msg .message-group').append(closeBtn)
									$('.quote-msg').find('.quote-close').click(function() {
										self.cancelQuote();
									});
									
									// define a função de clique, pra deletar uma mensagem que você não deseja citar
									$('.quote-msg').find('.delete-msg-btn')
										.click(function() {
											$('.quote-msg').find('.message').has(this).find('.accessory').remove();
											$('.quote-msg').find('.message').has(this).find('.message-text').remove();
											deleteTooltip.remove();
											if ($('.quote-msg').find('.message-text').length == 0) {
												self.cancelQuote();
											}
										})
										.on('mouseover.citador', function() {
											$(".tooltips").append(deleteTooltip);
											var position = $(this).offset();
											position.top -= 30;
											position.left += $(this).width()/2 - deleteTooltip.width()/2 - 11;
											deleteTooltip.offset(position);
											$(this).on("mouseout.citador", function () {
												$(this).off("mouseout.citador");
												deleteTooltip.remove();
											})
										});
									
									$('.content .channel-textarea textarea').focus();

									if (range) {
										var startPost = $(range.startContainer).closest('.comment'),
											endPost   = $(range.endContainer).closest('.comment');
											
										if (startPost.is(endPost) && startPost.is(thisPost) && startPost.length && endPost.length) {
											text = range.toString().trim();
											$('.quote-msg').find(".markup").remove();
											$('.quote-msg').find(".accessory").remove();
											$('.quote-msg').find(".message:not(.first)").remove();
											$('.quote-msg').find(".message.first").find(".message-text").append('<div class="markup">' + text + '</div>');
										}
									}
								}
								
								if (quoting == true) {
									$('.quote-msg').find('.message-group').remove();
									this.createQuote();
								}
								
								if (quoting == false) {
									$('.channel-textarea').prepend('<div class="quote-msg"></div>');
									quoting = true;
									this.createQuote();
								}
							});
					}
				});
				todasMensagens.on('mouseleave',function() {
					if (nomeData.find('.citar-btn').length == 1) {
						$(this).find('.citar-btn').empty().remove();
					}
				});
			}
		});
		this.log(this.startMsg, "info");
	}
	attachParser() {
		var el   = $('.channel-textarea textarea'),
			self = this;
			
		if (el.length == 0) return;
		
		this.handleKeypress = function(e) {
			var code = e.keyCode || e.which;
			if (code !== 13) return;
			try {
				if (isQuote == true) {
					if (e.shiftKey || $('.channel-textarea-autocomplete-inner').length >= 1) return;
					
					var color     = $('.quote-msg').find('.user-name').css('color'),
						user      = $('.quote-msg').find('.user-name').text(),
						avatarUrl = $('.quote-msg').find('.avatar-large').css('background-image').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, ''),
						oldText   = $('.content .channel-textarea textarea').val(),
						hourpost  = $('.quote-msg').find('.timestamp').text(),
						quoteMsg  = $('.quote-msg').find('.comment'),
						text      = '';
					
					// trocar todas as edições do markup pra texto
					quoteMsg.find(  'pre'  ).each(function() {$(this).html(`${$(this).find('code').attr('class').split(' ')[1] || ""}\n${$(this).find('code').text()}`)});
					quoteMsg.find('.markup').each(function() {$(this).html($(this).html().replace(/<\/?code( class="inline")?>/g, "`"))});
					quoteMsg.find('.markup').each(function() {$(this).html($(this).html().replace(/<\/?pre>/g, "```"))});
					quoteMsg.find('.markup').each(function() {$(this).html($(this).html().replace(/<\/?strong>/g, "**"))});
					quoteMsg.find('.markup').each(function() {$(this).html($(this).html().replace(/<\/?em>/g, "*"))});
					quoteMsg.find('.markup').each(function() {$(this).html($(this).html().replace(/<\/?s>/g, "~~"))});
					quoteMsg.find('.markup').each(function() {$(this).html($(this).html().replace(/<\/?u>/g, "__"))});
					
					// trocar os emotes por texto
					quoteMsg.find('.emotewrapper').each(function() {$(this).html($(this).find('img').attr('alt'));});
					quoteMsg.find(    '.emoji'   ).each(function() {$(this).html($(this).attr('alt'));});
					
					// definir texto pra citar
					quoteMsg.find('.markup').each(function() {text += $(this).clone().end().text() + '\n';});
					
					// converte a cor do cargo pra hex 
					color = color.split(/rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/);
					color = Number('0x' + self.rgbToHex(color[1], color[2], color[3]).toString());
					
					// os dados do embed 
					var data = {
							content: oldText,
							embed: {
								author: {
									name: user,
									icon_url: avatarUrl
								},
								description: text,
								footer: {
									text: `in ${chanName}${atServerName} - ${hourpost}`
								},
								image: {url: ''},
								fields: [],
								color: color
							}
						},
						chanID = window.location.pathname.split('/').pop();
					
					// checar se tem alguma imagem na mensagem citada, e adicionar ao embed final
					if ($('.quote-msg').find('.attachment-image').length >= 1) {
						data.embed.image.url = $('.quote-msg').find('.attachment-image a').attr('href');
					}
					
					// checar se tem algum arquivo na mensagem citada, e adicionar ao embed final
					if ($('.quote-msg').find('.attachment').length >= 1) {
						for (i = 0; i < $('.quote-msg').find('.attachment').length; i++) {
							var value     = $($('.quote-msg').find('.attachment')[i]).find('.attachment-inner a').text(),
								link      = $($('.quote-msg').find('.attachment')[i]).find('.attachment-inner a').attr('href'),
								attachNum = i + 1;
							data.embed.fields.push({name: "Attachment #" + attachNum, value: `📁 [${value}](${link})`});
						}
					}
					
					// post do embed final
					$.ajax({
						type : "POST",
						url : `https://discordapp.com/api/channels/${chanID}/messages`,
						headers : {
							"Authorization": token
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
			if (e.keyCode == 27 && isQuote == true) {
				self.cancelQuote();
			}
		}, false);
	}
	getName         () { return "Citador";             }
	getDescription  () { return "Cita alguém no chat"; }
	getVersion      () { return "1.5.2";               }
	getAuthor       () { return "Nirewen";             }
	getSettingsPanel() { return '';                    }
	load            () {};
	unload() {
		$(document).off("mouseover.citador");
		$('.messages .message-group').off('mouseover');
		$('.messages .message-group').off('mouseleave');
		BdApi.clearCSS("citador-css");
	}
	stop() {
		$(document).off("mouseover.citador");
		$('.messages .message-group').off('mouseover');
		$('.messages .message-group').off('mouseleave');
		BdApi.clearCSS("citador-css");
	}
	onSwitch() {
		this.attachParser();
		if (isQuote == true) {
			if (serverName !== $('.guild-header header span').text() && serverName !== "") {
				atServerName = " at " + serverName;
			} else if (serverName == $('.guild-header header span').text() || serverName == ""){
				atServerName = '';
			}
			$('.channel-textarea').prepend(elem);
		}
	}
}
