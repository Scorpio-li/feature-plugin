<template>
    <div>
        <h2>Css-Doodle</h2>
        <css-doodle>
            :doodle {
                @grid: 18 / 100vmax;
                background: #0a0c27;
            }
            --hue: calc(180 + 1.5 * @row * @col);
            background: hsl(var(--hue), 50%, 70%);
            margin: -.5px;
            transition: @r(.5s) ease;
            clip-path: polygon(@pick(
                '0 0, 100% 0, 100% 100%',
                '0 0, 100% 0, 0 100%',
                '0 0, 100% 100%, 0 100%',
                '100% 0, 100% 100%, 0 100%'
            ));
        </css-doodle>

        <css-doodle @click="update">
            :doodle {
                @grid: 1x100 / 100vmin;
                --rotate: @r(0, 360)deg;
            }
            @place-cell: center;
            @size: calc(100% - @calc(@index() - 1) * 1%);
            transform: rotate(calc(@index() * var(--rotate)));
            border: 3px solid hsla(
                calc(calc(100 - @index()) * 2.55), 
                calc(@index() * 1%), 
                50%,
                calc(@index() / 100)
            );
        </css-doodle>

    </div>
</template>

<script>
export default {
    methods: {
        update(e) {
            e.target.update && e.target.update(); 
        }
    },
}
</script>

