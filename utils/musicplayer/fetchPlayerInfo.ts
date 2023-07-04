import {spotifyAlbumCheck, spotifyPlaylistCheck, spotifyTrackCheck} from "./spotify/regexChecks/spotifyCheck";
import {searchSpotifyTrack} from "./spotify/search/spotifyTrack";
import {searchSpotifyPlaylistAlbum} from "./spotify/search/spotifyPlaylistAlbum";
import {matchYoutubeSingleLink, matchYoutubePlaylist, matchYoutudotbePlaylist, finalInvalidURLcheck} from "./youtube/regexChecks/ytCheck";
import {searchYTsong} from "./youtube/search/SongSearch";
import {searchYTPlaylist} from "./youtube/search/YTplaylistLink";
import {searchSingleYTlink} from "./youtube/search/YTsinglelink";


export {fetchPlayerInfo};


const fetchPlayerInfo = async(text : string) => {
    try {
        if (await spotifyTrackCheck(text)) {
            let spotifyTrackResult = await searchSpotifyTrack(text);
            return spotifyTrackResult;
        };
        if (await spotifyAlbumCheck(text)||await spotifyPlaylistCheck(text)) {
            let spotifyPlaylistAlbumResult = await searchSpotifyPlaylistAlbum(text);
            return spotifyPlaylistAlbumResult;
        };
        if (await matchYoutubeSingleLink(text)) {
            let youtubeSingleLinkResult = await searchSingleYTlink(text);
            return youtubeSingleLinkResult;
        };
        if (await matchYoutubePlaylist(text)) {
            let youtubePlaylistResult = await searchYTPlaylist(text);
            return youtubePlaylistResult;
        };
        if (await matchYoutudotbePlaylist(text)) {
            let newtext = text.replace("youtu.be","www.youtube.com");
            let youtubePlaylistResult = await searchYTPlaylist(newtext);
            return youtubePlaylistResult;
        };
        if (await finalInvalidURLcheck(text)) {
            throw new Error("Cannot find song with this input.");
        }
        else {
            let youtubeSongSearchResult = await searchYTsong(text);
            return youtubeSongSearchResult;
        };
    } catch (error) {
        throw new Error("Cannot find song with this input.");
    };

};