import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            light: '#264b6c',
            main: '#012840',
            dark: '#001420',
            contrastText: '#b34343  ',
        },
        secondary: {
            light: '#92b9d5',
            main: '#6593A6',
            dark: '#3d5c6c',
            contrastText: '#A66969 ',
        },
        action: {
            light: '#4dffff',
            main: '#05F2F2',
            dark: '#009090',
            contrastText: '#F2057A ',
        },
        error: {
            light: '#ffb73e',
            main: '#F27405',
            dark: '#994500',
            contrastText: '#05F2D1 ',
        },
        accent: {
            light: '#522422',
            main: '#260D0B',
            dark: '#0f0403',
            contrastText: '#0B2673 ',
        },
    },
});
export default theme;