// import Cookies from 'js-cookie';

const app = {
    state: {
        sidebar: {
            isCollapse: false
        },
        onXHR: false,
        // theme: 'default',
        // livenewsChannels: Cookies.get('livenewsChannels') || '[]'
    },
    mutations: {
        TOGGLE_SIDEBAR: state => {
            state.sidebar.isCollapse = !state.sidebar.isCollapse
            // if (state.sidebar.opened) {
            //   Cookies.set('sidebarStatus', 1);
            // } else {
            //   Cookies.set('sidebarStatus', 0);
            // }
            // state.sidebar.opened = !state.sidebar.opened;
        },
        OPEN_SIDEBAR: state => {
            state.sidebar.isCollapse = false
        },
        SET_ONXHR: state => {
            state.onXHR = true
        },
        SET_NOTXHR: state => {
            state.onXHR = false
        },
        // SET_LIVENEWS_CHANNELS: (status, channels) => {
        //   status.livenewsChannels = JSON.stringify(channels);
        //   Cookies.set('livenewsChannels', JSON.stringify(channels));
        // }
    },
    // actions: {
    //   ToggleSideBar: ({ commit }) => {
    //     commit('TOGGLE_SIDEBAR')
    //   },
    //   setTheme: ({ commit }, theme) => {
    //     commit('SET_THEME', theme)
    //   },
    //   setlivenewsChannels: ({ commit }, channels) => {
    //     commit('SET_LIVENEWS_CHANNELS', channels)
    //   }
    // }
};

export default app;
