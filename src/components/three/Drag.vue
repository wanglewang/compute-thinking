<template>

</template>

<script>
    import * as Three from 'three'
    import {DragControls} from '../../assets/js/three/DragControls'
    export default {
        name: "Drag",
        data() {
            return{
                container:null,
                camera:null, scene:null, renderer:null,
                controls:null, group:null,
                objects : [],
                enableSelection : false,
                mouse:new Three.Vector2(),
                raycaster:new Three.Raycaster()
            }
        },
        methods:{
            init:function () {

                this.container = document.createElement( 'div' );
                document.body.appendChild( this.container );
                this.camera = new Three.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 5000 );
                this.camera.position.z = 1000;
                this.scene = new Three.Scene();
                this.scene.background = new Three.Color( 0xf0f0f0 );
                this.scene.add( new Three.AmbientLight( 0x505050 ) );

                let light = new Three.SpotLight( 0xffffff, 1.5 );
                light.position.set( 0, 500, 2000 );
                light.angle = Math.PI / 9;
                light.castShadow = true;
                light.shadow.camera.near = 1000;
                light.shadow.camera.far = 4000;
                light.shadow.mapSize.width = 1024;
                light.shadow.mapSize.height = 1024;

                this.scene.add( light );
                this.group = new Three.Group();
                this.scene.add( this.group );
                let geometry = new Three.BoxBufferGeometry( 40, 40, 40 );
                for ( let i = 0; i < 200; i ++ ) {
                    let object = new Three.Mesh( geometry, new Three.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

                    object.position.x = Math.random() * 1000 - 500;
                    object.position.y = Math.random() * 600 - 300;
                    object.position.z = Math.random() * 800 - 400;

                    object.rotation.x = Math.random() * 2 * Math.PI;
                    object.rotation.y = Math.random() * 2 * Math.PI;
                    object.rotation.z = Math.random() * 2 * Math.PI;

                    object.scale.x = Math.random() * 2 + 1;
                    object.scale.y = Math.random() * 2 + 1;
                    object.scale.z = Math.random() * 2 + 1;

                    object.castShadow = true;
                    object.receiveShadow = true;
                    this.scene.add( object );
                    this.objects.push( object );
                }
                this.renderer = new Three.WebGLRenderer( { antialias: true } );
                this.renderer.setPixelRatio( window.devicePixelRatio );
                this.renderer.setSize( window.innerWidth, window.innerHeight );
                this.renderer.shadowMap.enabled = true;
                this.renderer.shadowMap.type = Three.PCFShadowMap;
                this.container.appendChild( this.renderer.domElement );
                this.controls = new DragControls( [ ... this.objects ], this.camera, this.renderer.domElement );
                this.controls.addEventListener( 'drag', this.render );
                //
                window.addEventListener( 'resize', this.onWindowResize, false );
                document.addEventListener( 'click', this.onClick, false );
                window.addEventListener( 'keydown', this.onKeyDown, false );
                window.addEventListener( 'keyup', this.onKeyUp, false );
                this.render();
            },
            onWindowResize() {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize( window.innerWidth, window.innerHeight );
                this.render();
            },
            onKeyDown( event ) {
                this.enableSelection = ( event.keyCode === 16 ) ? true : false;
            },
            onKeyUp() {
                this.enableSelection = false;
            },
            onClick( event ) {
                event.preventDefault();
                if ( this.enableSelection === true ) {
                    let draggableObjects = this.controls.getObjects();
                    draggableObjects.length = 0;
                    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
                    this.raycaster.setFromCamera( this.mouse, this.camera );
                    let intersections = this.raycaster.intersectObjects( this.objects, true );
                    if ( intersections.length > 0 ) {
                        let object = intersections[ 0 ].object;
                        if ( this.group.children.includes( object ) === true ) {
                            object.material.emissive.set( 0x000000 );
                            this.scene.attach( object );
                        } else {
                            object.material.emissive.set( 0xaaaaaa );
                            this.group.attach( object );
                        }
                        this.controls.transformGroup = true;
                        draggableObjects.push( this.group );
                    }
                    if ( this.group.children.length === 0 ) {
                        this.controls.transformGroup = false;
                        draggableObjects.push( ...this.objects );
                    }
                }
                render();
            },
            render() {
                this.renderer.render( this.scene, this.camera );
            }
        },
        mounted() {
            this.init()
        }

    }
</script>

<style scoped>

</style>
