const languages = {
    pt: {
      description: "Cita alguém no chat",
      startMsg: "Iniciado",
      quoteTooltip: "Citar",
      deleteTooltip: "Excluir",
      noPermTooltip: "Sem permissão para citar",
      noChatTooltip: "Sem permissão para enviar mensagens",
      attachment: "Anexo",
      settings: {
        useFallbackCodeblock: {
          title: "Usar citação em formato de bloco de código",
          choices: ["Nunca", "Sempre", "Somente quando sem permissão"]
        },
        disableServers: {
          title: "Desabilitar citação em embed para servidores específicos",
          description: "Clique em um servidor para desabilitar citações em embed para ele. Clique novamente para habilitar.</br>Você também pode clicar com o botão direito em um servidor e habilitar ou desabilitar por lá.",
          context: "Citação em embed"
        },
        reset: "Redefinir configurações"
      }
    },
    de: {
      description: "Zitiert jemanden im Chat",
      startMsg: "Gestartet",
      quoteTooltip: "Zitieren",
      deleteTooltip: "Löschen",
      noPermTooltip: "Keine Rechte, zu zitieren",
      noChatTooltip: "No permission to send messages",
      attachment: "Anhang",
      settings: {
        useFallbackCodeblock: {
          title: "Use codeblock quote format",
          choices: ["Never", "Always", "Only when without permission"]
        },
        disableServers: {
          title: "Disable embed quotes for specific servers",
          description: "Click a server to disable embed quotes for it. Click again to enable.</br>You can also right-click a guild and toggle it.",
          context: "Embed quotes"
        },
        reset: "Reset settings"
      }
    },
    ru: {
      description: "Позволяет цитировать сообщения",
      startMsg: "Запущен",
      quoteTooltip: "Цитировать",
      deleteTooltip: "Удалить",
      noPermTooltip: "Нет прав для цитирования",
      noChatTooltip: "No permission to send messages",
      attachment: "Вложение",
      settings: {
        useFallbackCodeblock: {
          title: "Use codeblock quote format",
          choices: ["Never", "Always", "Only when without permission"]
        },
        disableServers: {
          title: "Disable embed quotes for specific servers",
          description: "Click a server to disable embed quotes for it. Click again to enable.</br>You can also right-click a guild and toggle it.",
          context: "Embed quotes"
        },
        reset: "Reset settings"
      }
    },
    ja: {
      description: "誰かをチャットで引用します",
      startMsg: "起動完了",
      quoteTooltip: "引用",
      deleteTooltip: "削除",
      noPermTooltip: "引用する権限がありません",
      noChatTooltip: "No permission to send messages",
      attachment: "添付ファイル",
      settings: {
        useFallbackCodeblock: {
          title: "Use codeblock quote format",
          choices: ["Never", "Always", "Only when without permission"]
        },
        disableServers: {
          title: "Disable embed quotes for specific servers",
          description: "Click a server to disable embed quotes for it. Click again to enable.</br>You can also right-click a guild and toggle it.",
          context: "Embed quotes"
        },
        reset: "Reset settings"
      }
    },
    en: {
      description: "Quotes somebody in chat",
      startMsg: "Started",
      quoteTooltip: "Quote",
      deleteTooltip: "Delete",
      noPermTooltip: "No permission to quote",
      noChatTooltip: "No permission to send messages",
      attachment: "Attachment",
      settings: {
        useFallbackCodeblock: {
          title: "Use codeblock quote format",
          choices: ["Never", "Always", "Only when without permission"]
        },
        disableServers: {
          title: "Disable embed quotes for specific servers",
          description: "Click a server to disable embed quotes for it. Click again to enable.</br>You can also right-click a guild and toggle it.",
          context: "Embed quotes"
        },
        reset: "Reset settings"
      }
    }
  }
}

window.CitadorLanguages = languages;