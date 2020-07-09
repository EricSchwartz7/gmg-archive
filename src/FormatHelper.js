export default {
    // formatSetlist (setlist) {
    //     if (setlist) {
    //         return setlist.replace(/[\n\r]/g, ', ');
    //     }
    // }

    formatSetlist(setlist, setNumber) {
        if (setlist) {
            return setlist
                .filter(song => song.set === setNumber)
                .map((song, i) => {
                    return (i === setlist.length - 1) ? song.title : `${song.title}, `
                });
        }
    }
}