const { Pool } = require('pg');
const NotFoundError = require('../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongsById({ id }) {
    const playlistQuery = `
        SELECT p.id id, p.name name, u.username username FROM playlists p 
        LEFT JOIN users u ON p.owner = u.id
        WHERE p.id = $1
        `;
    const playlistResultAsync = this._pool.query(playlistQuery, [id]);

    const songsQuery = `
        SELECT s.id id, s.title title, s.performer performer FROM songs s
        RIGHT JOIN playlist_songs ps ON s.id = ps.song_id
        WHERE ps.playlist_id = $1`;
    const songsResultAsync = this._pool.query(songsQuery, [id]);

    const [playlistResult, songsResult] = await Promise.all([
      playlistResultAsync,
      songsResultAsync,
    ]);

    if (!playlistResult.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return { ...playlistResult.rows[0], songs: songsResult.rows };
  }
}

module.exports = PlaylistSongsService;
