class Listener {
  constructor(playlistService, mailSender) {
    this._playlistService = playlistService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());

      const playlists = await this._playlistService.getPlaylistSongs(playlistId);

      const filename = `playlist-${playlists.name}.json`;

      const sendResult = await this._mailSender.sendEmail(
        targetEmail,
        `Export playlist ${playlists.id}`,
        JSON.stringify({
          playlist: playlists,
        }),
        filename,
      );

      console.log('Successfully sent email to', sendResult);
    } catch (error) {
      console.error('An unexpected error happened while sending email', error);
    }
  }
}

module.exports = Listener;
