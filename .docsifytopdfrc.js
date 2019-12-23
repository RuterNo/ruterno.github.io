module.exports = {
  contents: ['_sidebar.md'],
  pdfOptions: {
    scale: 0.8,
    margin: {
      top: '5px',
      bottom: '5px'
    }
  },
  emulateMedia: 'screen',
  pathToPublic: 'pdf/readme.pdf',
  removeTemp: true // remove generated .md and .html or not
};
