import electron from "electron";

export default function createMenuTemplate(app, win) {
  const template = [{
    label: "Edit",
    submenu: [{
      label: "Undo",
      accelerator: "CmdOrCtrl+Z",
      role: "undo"
    }, {
      label: "Redo",
      accelerator: "Shift+CmdOrCtrl+Z",
      role: "redo"
    }, {
      type: "separator"
    }, {
      label: "Cut",
      accelerator: "CmdOrCtrl+X",
      role: "cut"
    }, {
      label: "Copy",
      accelerator: "CmdOrCtrl+C",
      role: "copy"
    }, {
      label: "Paste",
      accelerator: "CmdOrCtrl+V",
      role: "paste"
    }, {
      label: "Select All",
      accelerator: "CmdOrCtrl+A",
      role: "selectall"
    }]
  }, {
    label: "View",
    submenu: [{
      label: "Reload",
      accelerator: "CmdOrCtrl+R",
      click: function(item, focusedWindow) {
        if(focusedWindow) {
          // on reload, start fresh and close any old
          // open secondary windows
          if(focusedWindow.id === 1) {
            focusedWindow.getAllWindows().forEach(function(win) {
              if(win.id > 1) {
                win.close();
              }
            });
          }
          focusedWindow.reload();
        }
      }
    }, {
      label: "Toggle Full Screen",
      accelerator: (function() {
        if(process.platform === "darwin") {
          return "Ctrl+Command+F";
        } else {
          return "F11";
        }
      })(),
      click: function(item, focusedWindow) {
        if(focusedWindow) {
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      }
    }, {
      type: "separator"
    }]
  }, {
    label: "Window",
    role: "window",
    submenu: [{
      label: "Minimize",
      accelerator: "CmdOrCtrl+M",
      role: "minimize"
    }, {
      label: "Close",
      accelerator: "CmdOrCtrl+W",
      role: "close"
    }]
  }, {
    label: "Help",
    role: "help",
    submenu: [{
      label: "Learn More",
      click: function() {
        electron.shell.openExternal("https://github.com/Blanket-Warriors/BentoTime");
      }
    }, {
      label: "Toggle Developer Tools",
      accelerator: process.platform === "darwin" ? "Alt+Command+I" : "Ctrl+Shift+I",
      click(item, focusedWindow) {
        if (focusedWindow)
          focusedWindow.webContents.toggleDevTools();
      }
    }]
  }];

  function addUpdateMenuItems(items, position) {
    const version = electron.app.getVersion();
    let updateItems = [{
      label: `Version ${version}`,
      enabled: false
    }, {
      label: "Checking for Update",
      enabled: false,
      key: "checkingForUpdate"
    }, {
      label: "Check for Update",
      visible: false,
      key: "checkForUpdate",
      click: function() {
        require("electron").autoUpdater.checkForUpdates();
      }
    }, {
      label: "Restart and Install Update",
      enabled: true,
      visible: false,
      key: "restartToUpdate",
      click: function() {
        require("electron").autoUpdater.quitAndInstall();
      }
    }];

    items.splice.apply(items, [position, 0].concat(updateItems));
  }

  if(process.platform === "darwin") {
    const name = electron.app.getName();
    template.unshift({
      label: name,
      submenu: [{
        label: `About ${name}`,
        role: "about"
      }, {
        type: "separator"
      }, {
        label: "Services",
        role: "services",
        submenu: []
      }, {
        type: "separator"
      }, {
        label: `Hide ${name}`,
        accelerator: "Command+H",
        role: "hide"
      }, {
        label: "Hide Others",
        accelerator: "Command+Alt+H",
        role: "hideothers"
      }, {
        label: "Show All",
        role: "unhide"
      }, {
        type: "separator"
      }, {
        label: "Quit",
        accelerator: "Command+Q",
        click: function() {
          app.quit();
        }
      }]
    });
    // Window menu.
    template[3].submenu.push({
      type: "separator"
    }, {
      label: "Bring All to Front",
      role: "front"
    });

    addUpdateMenuItems(template[0].submenu, 1);
  }

  if(process.platform === "win32") {
    const helpMenu = template[template.length - 1].submenu;
    addUpdateMenuItems(helpMenu, 0);
  }

  return template;
}
