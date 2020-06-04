export default {
    // formatSetlist (setlist) {
    //     if (setlist) {
    //         return setlist.replace(/[\n\r]/g, ', ');
    //     }
    // }

    formatSetlist(setlist) {
        if (setlist) {
            return setlist.map((song, i) => {
                return (i === setlist.length - 1) ? song.title : `${song.title}, `
            });
        }
    }
}