// eslint-disable-next-line import/no-extraneous-dependencies
const autoBind = require('auto-bind');

class Listener {
  constructor(playlistSongsService, mailSenderService) {
    this._playlistSongsService = playlistSongsService;
    this._mailSenderService = mailSenderService;

    autoBind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());

      const notes = await this._playlistSongsService.getPlaylistSongsById({ id: playlistId });
      const result = await this._mailSenderService.sendEmail(targetEmail, JSON.stringify(notes));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
