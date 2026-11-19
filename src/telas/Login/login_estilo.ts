import { StyleSheet } from 'react-native';
import { cores, espaco, fontes } from '@/theme/tema';

export const estilos = StyleSheet.create({
    topo: {
        alignItems: 'center',
        gap: espaco.sm,
        marginTop: espaco.xl,
    },

    titulo: {
        fontFamily: fontes.seminegrito,
        fontSize: 26,
        color: cores.texto,
        marginTop: espaco.lg,
    },

    subtitulo: {
        fontFamily: fontes.regular,
        fontSize: 14,
        color: cores.textoSuave,
    },

    formulario: {
        gap: espaco.md,
    },

    esqueci: {
        alignSelf: 'flex-end',
    },

    link: {
        fontFamily: fontes.media,
        fontSize: 14,
        color: cores.primaria,
    },

    sucesso: {
        fontFamily: fontes.media,
        fontSize: 13,
        color: cores.primariaEscura,
        backgroundColor: cores.primariaSuave,
        padding: espaco.sm,
        borderRadius: 10,
        textAlign: 'center',
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
