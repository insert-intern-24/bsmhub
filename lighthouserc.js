module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/'],
      startServerCommand: 'npm run start',
    },
    assert: {
      preset: 'lighthouse:recommended',
    },
    upload: {
      target: 'lhci',
    },
  },
};
