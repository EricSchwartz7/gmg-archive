export default {
    formatSetlist (setlist) {
        if (setlist) {
            return setlist.replace(/[\n\r]/g, ', ');
        }
    }
}