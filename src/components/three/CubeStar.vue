<template>
    <div style="margin-left: 370px">
        <div id="container"></div>
    </div>
</template>

<script>
    import * as Three from 'three'

    export default {
        name: 'CubeStar',
        data () {
            return {
                camera: null,
                scene: null,
                renderer: null,
                mesh: null
            }
        },
        methods: {
            init: function () {
                let container = document.getElementById('container')
                /**
                 *  创建场景对象
                 */
                this.scene = new Three.Scene()
                /**
                 * 创建网格模型
                 */
                let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2)//创建一个立方体几何对象
                let material = new Three.MeshNormalMaterial()//创建材质对象
                this.mesh = new Three.Mesh(geometry, material)//网格模型对象
                this.scene.add(this.mesh)//将网格模型添加到场景中
                /**
                 * 设置相机
                 */
                this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 10)
                this.camera.position.z = 0.6
                /**
                 * 设置渲染器
                 */
                this.renderer = new Three.WebGLRenderer({antialias: true})
                this.renderer.setSize(container.clientWidth, container.clientHeight)
                container.appendChild(this.renderer.domElement)
            },
            animate: function () {
                /**
                 * 递归渲染
                 */
                requestAnimationFrame(this.animate)
                this.mesh.rotation.x += 0.01
                this.mesh.rotation.y += 0.02
                this.renderer.render(this.scene, this.camera)
            }
        },
        mounted () {
            this.init()
            this.animate()
        }
    }
</script>
<style scoped>
    #container {
        width: 800px;
        height: 688px;
    }
</style>
