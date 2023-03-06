# HOMESTRI-dragdrop
This is the frontend for a robot experiment involving trust.

## Installation

Use [nvm](https://github.com/nvm-sh/nvm) to manage an updated npm installation.
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

Install npm (node 18) using
```
nvm install --lts
nvm use --lts
```

# Use

You can build static html file for distribution, but they are currently injecting jatos, which breaks things. To get around this for now, run the development html server.
```
npm run start-dev
```

The console will tell you where to navigate to if it doesn't automatically open a browser for you.
