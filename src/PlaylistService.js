const { Pool } = require('pg');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongs(id) {
    const query = {
      text: `
        SELECT p.id, p.name, 
          COALESCE(songs.array, '[]') as songs
        FROM playlists p
        INNER JOIN users u ON p.owner_id = u.id
        LEFT JOIN (
          SELECT ps.playlist_id,
            json_agg(
              json_build_object('id', s.id, 'title', s.title, 'performer', s.performer)
            ) AS array
          FROM playlist_songs ps
          INNER JOIN songs s ON s.id = ps.song_id
          GROUP BY ps.playlist_id
        ) songs ON songs.playlist_id = p.id 
        WHERE p.id = $1
      `,
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new Error(`Playlist with id ${id}} was not found`);
    }

    return rows[0];
  }
}

module.exports = PlaylistService;
