<template>
    <div style="margin-left: 370px">
        <div id="container"></div>
    </div>
</template>

<script>
    import * as Three from 'three'
    import {TrackballControls} from "../../assets/js/three/TrackballControls";
    import Stats from "../../assets/js/three/stats.module";

    export default {
        name: 'HeartStar',
        data () {
            return {
                camera: null,
                scene: null,
                renderer: null,
                mesh: null,
                controls:null,
                stats:null
            }
        },
        methods: {
            init: function () {
                let container = document.getElementById('container')
                this.renderer = new Three.WebGLRenderer( { antialias: true } );
                this.renderer.setPixelRatio( window.devicePixelRatio );
                console.log(800, 688 )
                this.renderer.setSize( 800, 688 );
                container.appendChild( this.renderer.domElement );

                this.scene = new Three.Scene();

                this.camera = new Three.PerspectiveCamera( 45.0, 800 / 688, 100, 1500.0 );
                this.camera.position.z = 480.0;
                this.scene.add( this.camera );

                this.controls = new TrackballControls( this.camera, this.renderer.domElement );
                this.controls.minDistance = 100.0;
                this.controls.maxDistance = 800.0;
                this.controls.dynamicDampingFactor = 0.1;

                this.scene.add( new Three.AmbientLight( 0xffffff, 0.2 ) );

                let light = new Three.PointLight( 0xffffff, 0.7 );
                this.camera.add( light );
                this.createScene();
                this.stats = new Stats();
                container.appendChild( this.stats.dom );
                container.addEventListener('resize', this.onWindowResize, false)
            },
            createGeometry() {

                let heartShape = new Three.Shape(); // From http://blog.burlock.org/html5/130-paths
                let x = 0, y = 0;

                heartShape.moveTo( x + 25, y + 25 );
                heartShape.bezierCurveTo( x + 25, y + 25, x + 20, y, x, y );
                heartShape.bezierCurveTo( x - 30, y, x - 30, y + 35, x - 30, y + 35 );
                heartShape.bezierCurveTo( x - 30, y + 55, x - 10, y + 77, x + 25, y + 95 );
                heartShape.bezierCurveTo( x + 60, y + 77, x + 80, y + 55, x + 80, y + 35 );
                heartShape.bezierCurveTo( x + 80, y + 35, x + 80, y, x + 50, y );
                heartShape.bezierCurveTo( x + 35, y, x + 25, y + 25, x + 25, y + 25 );

                let extrudeSettings = {
                    depth: 16,
                    bevelEnabled: true,
                    bevelSegments: 1,
                    steps: 2,
                    bevelSize: 1,
                    bevelThickness: 1
                };

                let geometry = new Three.ExtrudeGeometry( heartShape, extrudeSettings );
                geometry.rotateX( Math.PI );
                geometry.scale( 0.4, 0.4, 0.4 );

                return geometry;
            },
            createScene() {
                let bufferGeometry = new Three.BufferGeometry();
                let radius = 125;
                let count = 80;
                let positions = [];
                let normals = [];
                let colors = [];
                let vector = new Three.Vector3();
                let color = new Three.Color( 0xffffff );
                let heartGeometry = this.createGeometry();
                let geometry = new Three.Geometry();

                for ( let i = 1, l = count; i <= l; i ++ ) {
                    let phi = Math.acos( - 1 + ( 2 * i ) / l );
                    let theta = Math.sqrt( l * Math.PI ) * phi;
                    vector.setFromSphericalCoords( radius, phi, theta );
                    geometry.copy( heartGeometry );
                    geometry.lookAt( vector );
                    geometry.translate( vector.x, vector.y, vector.z );
                    color.setHSL( ( i / l ), 1.0, 0.7 );
                    geometry.faces.forEach( function ( face ) {
                        positions.push( geometry.vertices[ face.a ].x );
                        positions.push( geometry.vertices[ face.a ].y );
                        positions.push( geometry.vertices[ face.a ].z );
                        positions.push( geometry.vertices[ face.b ].x );
                        positions.push( geometry.vertices[ face.b ].y );
                        positions.push( geometry.vertices[ face.b ].z );
                        positions.push( geometry.vertices[ face.c ].x );
                        positions.push( geometry.vertices[ face.c ].y );
                        positions.push( geometry.vertices[ face.c ].z );

                        normals.push( face.normal.x );
                        normals.push( face.normal.y );
                        normals.push( face.normal.z );
                        normals.push( face.normal.x );
                        normals.push( face.normal.y );
                        normals.push( face.normal.z );
                        normals.push( face.normal.x );
                        normals.push( face.normal.y );
                        normals.push( face.normal.z );

                        colors.push( color.r );
                        colors.push( color.g );
                        colors.push( color.b );
                        colors.push( color.r );
                        colors.push( color.g );
                        colors.push( color.b );
                        colors.push( color.r );
                        colors.push( color.g );
                        colors.push( color.b );
                    });
                }
                bufferGeometry.setAttribute( 'position', new Three.Float32BufferAttribute( positions, 3 ) );
                bufferGeometry.setAttribute( 'normal', new Three.Float32BufferAttribute( normals, 3 ) );
                bufferGeometry.setAttribute( 'color', new Three.Float32BufferAttribute( colors, 3 ) );
                let material = new Three.MeshPhongMaterial( { shininess: 80, vertexColors: true } );
                let mesh = new Three.Mesh( bufferGeometry, material );
                this.scene.add( mesh );
            },
            onWindowResize() {
                let container = document.getElementById('container')
                this.camera.aspect = 800 / 688;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize( 800, 688 );
            },
            animate() {
                requestAnimationFrame( this.animate );
                this.controls.update();
                this.stats.update();
                this.renderer.render( this.scene, this.camera );
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

