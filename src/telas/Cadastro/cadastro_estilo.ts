import { StyleSheet } from 'react-native';
import { cores, espaco, fontes } from '@/theme/tema';

export const estilos = StyleSheet.create({
    topo: {
        alignItems: 'center',
        gap: espaco.sm,
        marginTop: espaco.md,
    },

    titulo: {
        fontFamily: fontes.seminegrito,
        fontSize: 26,
        color: cores.texto,
        marginTop: espaco.md,
    },

    subtitulo: {
        fontFamily: fontes.regular,
        fontSize: 14,
        color: cores.textoSuave,
        textAlign: 'center',
    },

    formulario: {
        gap: espaco.md,
    },

    link: {
        fontFamily: fontes.media,
        fontSize: 14,
        color: cores.primaria,
    },

    erroGeral: {
        fontFamily: fontes.regular,
        fontSize: 13,
        color: cores.erro,
        textAlign: 'center',
    },

    rodape: {
        flexDirection: 'row',
        gap: espaco.xs,
        justifyContent: 'center',
        marginTop: 'auto',
    },

    textoRodape: {
        fontFamily: fontes.regular,
        fontSize: 14,
        color: cores.textoSuave,
    },
});
