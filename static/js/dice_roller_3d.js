(function () {
    const DICE_ICON_FACE_SCALE = 0.5;
    const DICE_SCALE = 1.5;
    const DICE_CENTER = [0.5, 0.2429341359, -0.5];
    const TABLE_SIZE = 16;

    const vertexes = [
        [0, 0, 0],
        [1, 0, 0],
        [1, 0.4858682718, 0],
        [1, 0.4858682718, -1],
        [0.6180339888, 0.7861513778, 0],
        [0, 0.4858682718, -1],
        [0, 0, -1],
        [0.3819660112, -0.300283106, -1],
        [1, -0.300283106, -0.3819660112],
        [0, 0.7861513778, -0.6180339888],
        [0.6180339887, -0.4858682718, -0.6180339887],
        [0.3819660113, 0.9717365435, -0.3819660113],
    ];

    const faceData = [
        { tris: [[0, 1, 2], [0, 2, 4]], label: '0' },
        { tris: [[0, 10, 8], [0, 8, 1]], label: '8' },
        { tris: [[0, 6, 7], [0, 7, 10]], label: '6' },
        { tris: [[0, 9, 5], [0, 5, 6]], label: '4' },
        { tris: [[0, 4, 11], [0, 11, 9]], label: '2' },
        { tris: [[3, 2, 1], [3, 1, 8]], label: '5' },
        { tris: [[3, 8, 10], [3, 10, 7]], label: '7' },
        { tris: [[3, 7, 6], [3, 6, 5]], label: '9' },
        { tris: [[3, 5, 9], [3, 9, 11]], label: '1' },
        { tris: [[3, 11, 4], [3, 4, 2]], label: '3' },
    ];

    const diceIconPaths = {
        normalSuccess: 'img/dices/SUCCESS_ICON.png',
        normalCriticalSuccess: 'img/dices/CRITICAL_SUCCESS_ICON.png',
        bloodBestialFailure: 'img/dices/BESTIAL_FAILURE_ICON.png',
        bloodSuccess: 'img/dices/BLOOD_SUCCESS_ICON.png',
        bloodMessyCritical: 'img/dices/MESSY_CRITICAL_ICON.png',
    };

    const diceFaceColors = {
        normal: '#2c2c2c',
        blood: '#8b0000',
    };

    const instances = new WeakMap();
    let sharedIconTextures = null;

    function ensureLibraries() {
        return window.THREE && window.CANNON;
    }

    function getContainer(containerOrSelector) {
        if (typeof containerOrSelector === 'string') {
            return document.querySelector(containerOrSelector);
        }

        return containerOrSelector;
    }

    function getDieType(detail) {
        if (detail.is_hunger) {
            return 'blood';
        }

        return [1, 2, 4, 6].includes(detail.result) ? 'blood' : 'normal';
    }

    function createScaledVertex(idx) {
        const v = vertexes[idx];
        return new THREE.Vector3(
            (v[0] - DICE_CENTER[0]) * DICE_SCALE,
            (v[1] - DICE_CENTER[1]) * DICE_SCALE,
            (v[2] - DICE_CENTER[2]) * DICE_SCALE,
        );
    }

    function getFaceNormal(face) {
        const tri = face.tris[0];
        const v0 = createScaledVertex(tri[0]);
        const v1 = createScaledVertex(tri[1]);
        const v2 = createScaledVertex(tri[2]);
        const edge1 = new THREE.Vector3().subVectors(v1, v0);
        const edge2 = new THREE.Vector3().subVectors(v2, v0);

        return new THREE.Vector3().crossVectors(edge1, edge2).normalize();
    }

    function computeFaceUVs(faceIndex) {
        const face = faceData[faceIndex];
        const uniqueIndices = [];

        face.tris.forEach(tri => {
            tri.forEach(idx => {
                if (!uniqueIndices.includes(idx)) {
                    uniqueIndices.push(idx);
                }
            });
        });

        const vertices3D = uniqueIndices.map(createScaledVertex);
        const center = new THREE.Vector3();
        vertices3D.forEach(v => center.add(v));
        center.divideScalar(vertices3D.length);

        const normal = getFaceNormal(face);
        let bitangent = new THREE.Vector3().subVectors(center, vertices3D[2]);
        let tangent = new THREE.Vector3().crossVectors(normal, bitangent).normalize();
        tangent = new THREE.Vector3(-tangent.x, -tangent.y, -tangent.z);

        const projected2D = vertices3D.map(v => {
            const relative = new THREE.Vector3().subVectors(v, center);
            return new THREE.Vector2(relative.dot(tangent), relative.dot(bitangent));
        });

        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;

        projected2D.forEach(p => {
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y);
        });

        const rangeX = maxX - minX || 1;
        const rangeY = maxY - minY || 1;
        const maxRange = Math.max(rangeX, rangeY);
        const uvMap = {};

        uniqueIndices.forEach((idx, i) => {
            const p = projected2D[i];
            uvMap[idx] = new THREE.Vector2(
                (p.x - minX + (maxRange - rangeX) / 2) / maxRange,
                -0.15 + (p.y - minY + (maxRange - rangeY) / 2) / maxRange * 1.45,
            );
        });

        return uvMap;
    }

    function loadDiceIconTexture(src) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;

        const ctx = canvas.getContext('2d');
        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 4;

        const image = new Image();
        image.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const size = canvas.width * DICE_ICON_FACE_SCALE;
            const offset = (canvas.width - size) / 2;
            ctx.drawImage(image, offset, offset, size, size);
            texture.needsUpdate = true;
        };
        image.src = src;

        return texture;
    }

    function getIconTextures() {
        if (!sharedIconTextures) {
            sharedIconTextures = {
                normalSuccess: loadDiceIconTexture(diceIconPaths.normalSuccess),
                normalCriticalSuccess: loadDiceIconTexture(diceIconPaths.normalCriticalSuccess),
                bloodBestialFailure: loadDiceIconTexture(diceIconPaths.bloodBestialFailure),
                bloodSuccess: loadDiceIconTexture(diceIconPaths.bloodSuccess),
                bloodMessyCritical: loadDiceIconTexture(diceIconPaths.bloodMessyCritical),
            };
        }

        return sharedIconTextures;
    }

    function getFaceIconTexture(label, dieType) {
        const value = parseInt(label, 10);
        const textures = getIconTextures();

        if (dieType === 'blood') {
            if (value === 1) return textures.bloodBestialFailure;
            if (value >= 6 && value <= 9) return textures.bloodSuccess;
            if (value === 0) return textures.bloodMessyCritical;
            return null;
        }

        if (value === 0) return textures.normalCriticalSuccess;
        if (value >= 6 && value <= 9) return textures.normalSuccess;
        return null;
    }

    function createFaceTexture(color) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 256, 256);

        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 180);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    function createD10(dieType) {
        const group = new THREE.Group();
        const color = diceFaceColors[dieType] || diceFaceColors.normal;
        group.userData.dieType = dieType;

        faceData.forEach((face, faceIndex) => {
            const geometry = new THREE.BufferGeometry();
            const positions = [];
            const uvs = [];
            const indices = [];
            const uvMap = computeFaceUVs(faceIndex);
            const vertexMap = new Map();
            let localIndex = 0;

            face.tris.forEach(tri => {
                tri.forEach(idx => {
                    if (!vertexMap.has(idx)) {
                        const vertex = createScaledVertex(idx);
                        const uv = uvMap[idx];
                        positions.push(vertex.x, vertex.y, vertex.z);
                        uvs.push(uv.x, uv.y);
                        vertexMap.set(idx, localIndex);
                        localIndex++;
                    }
                });
            });

            face.tris.forEach(tri => {
                indices.push(vertexMap.get(tri[0]), vertexMap.get(tri[1]), vertexMap.get(tri[2]));
            });

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            geometry.setIndex(indices);
            geometry.computeVertexNormals();

            const faceMaterial = new THREE.MeshStandardMaterial({
                map: createFaceTexture(color),
                roughness: 0.35,
                metalness: 0.45,
                side: THREE.DoubleSide,
            });
            const faceMesh = new THREE.Mesh(geometry, faceMaterial);
            faceMesh.castShadow = true;
            faceMesh.receiveShadow = true;
            group.add(faceMesh);

            const iconTexture = getFaceIconTexture(face.label, dieType);
            if (!iconTexture) {
                return;
            }

            const iconMaterial = new THREE.MeshStandardMaterial({
                map: iconTexture,
                transparent: true,
                depthWrite: false,
                roughness: 0.3,
                metalness: 0.2,
                side: THREE.DoubleSide,
                polygonOffset: true,
                polygonOffsetFactor: -1,
                polygonOffsetUnits: -1,
            });
            const iconMesh = new THREE.Mesh(geometry.clone(), iconMaterial);
            iconMesh.renderOrder = 1;
            group.add(iconMesh);
        });

        return group;
    }

    function createD10PhysicsBody() {
        const vertices = vertexes.map(v => new CANNON.Vec3(
            (v[0] - DICE_CENTER[0]) * DICE_SCALE,
            (v[1] - DICE_CENTER[1]) * DICE_SCALE,
            (v[2] - DICE_CENTER[2]) * DICE_SCALE,
        ));
        const faces = [];
        faceData.forEach(face => {
            face.tris.forEach(tri => faces.push(tri));
        });

        const shape = new CANNON.ConvexPolyhedron(vertices, faces);
        const body = new CANNON.Body({
            mass: 1,
            shape,
            material: new CANNON.Material({ friction: 0.55, restitution: 0.32 }),
        });

        body.linearDamping = 0.28;
        body.angularDamping = 0.32;
        return body;
    }

    class DiceRoller3D {
        constructor(container) {
            this.container = container;
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x2d3748);
            this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
            this.camera.position.set(0, 20, 0);
            this.camera.lookAt(0, 0, 0);
            this.camera.up.set(0, 0, -1);

            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.container.appendChild(this.renderer.domElement);

            this.world = new CANNON.World();
            this.world.gravity.set(0, -30, 0);
            this.world.broadphase = new CANNON.NaiveBroadphase();
            this.world.solver.iterations = 20;

            this.dice = [];
            this.bodies = [];
            this.isRolling = false;
            this.animationFrameId = null;
            this.raycaster = new THREE.Raycaster();
            this.pointer = new THREE.Vector2();
            this.selection = {
                enabled: false,
                max: 3,
                selectedIndexes: new Set(),
                selectableIndexes: new Set(),
                onChange: null,
            };

            this.createLights();
            this.createFloor();
            this.createWalls();
            this.resize();
            this.renderer.domElement.addEventListener('click', event => this.handlePointerClick(event));

            if (window.ResizeObserver) {
                this.resizeObserver = new ResizeObserver(() => this.resize());
                this.resizeObserver.observe(this.container);
            } else {
                window.addEventListener('resize', () => this.resize());
            }
            this.animate();
        }

        createLights() {
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.58);
            this.scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.86);
            directionalLight.position.set(5, 20, 5);
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
            directionalLight.shadow.camera.near = 0.5;
            directionalLight.shadow.camera.far = 50;
            directionalLight.shadow.camera.left = -15;
            directionalLight.shadow.camera.right = 15;
            directionalLight.shadow.camera.top = 15;
            directionalLight.shadow.camera.bottom = -15;
            this.scene.add(directionalLight);
        }

        createFloor() {
            const floorGeometry = new THREE.PlaneGeometry(TABLE_SIZE + 4, TABLE_SIZE + 4);
            const floorMaterial = new THREE.MeshStandardMaterial({
                color: 0x2d3748,
                roughness: 0.82,
                metalness: 0.18,
            });
            const floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.rotation.x = -Math.PI / 2;
            floor.receiveShadow = true;
            this.scene.add(floor);

            const floorShape = new CANNON.Plane();
            const floorBody = new CANNON.Body({ mass: 0 });
            floorBody.addShape(floorShape);
            floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
            this.world.addBody(floorBody);
        }

        createWalls() {
            [
                { pos: [0, 2, -TABLE_SIZE / 2], rot: [0, 0, 0] },
                { pos: [0, 2, TABLE_SIZE / 2], rot: [0, Math.PI, 0] },
                { pos: [-TABLE_SIZE / 2, 2, 0], rot: [0, Math.PI / 2, 0] },
                { pos: [TABLE_SIZE / 2, 2, 0], rot: [0, -Math.PI / 2, 0] },
            ].forEach(wall => {
                const wallBody = new CANNON.Body({ mass: 0 });
                wallBody.addShape(new CANNON.Plane());
                wallBody.position.set(...wall.pos);
                wallBody.quaternion.setFromEuler(...wall.rot);
                this.world.addBody(wallBody);
            });
        }

        resize() {
            const width = Math.max(1, this.container.clientWidth || 1);
            const height = Math.max(1, this.container.clientHeight || 1);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height, false);
        }

        clear() {
            this.setSelection({ enabled: false });
            this.dice.forEach(die => this.scene.remove(die.mesh));
            this.bodies.forEach(body => this.world.removeBody(body));
            this.dice = [];
            this.bodies = [];
            this.isRolling = false;
        }

        roll(diceDetails) {
            this.clear();
            this.isRolling = true;

            const rollDetails = diceDetails.length ? diceDetails : [{ is_hunger: false }];
            rollDetails.forEach((detail, index) => this.addDie(detail, index, rollDetails.length));

            return new Promise(resolve => {
                window.setTimeout(() => this.resolveWhenStopped(resolve), 500);
            });
        }

        rerollIndexes(indexes) {
            const rerollIndexes = Array.from(indexes || []);
            if (!rerollIndexes.length) {
                return Promise.resolve(this.getRolledDiceValues());
            }

            this.setSelection({ enabled: false });
            this.freezeDiceExcept(rerollIndexes);

            const rerollDetails = rerollIndexes.map(index => {
                const existingDie = this.dice.find(die => die.index === index);
                return {
                    index,
                    is_hunger: existingDie?.isHunger || false,
                };
            });

            rerollIndexes.forEach(index => this.removeDieByIndex(index));
            this.isRolling = true;

            rerollDetails.forEach((detail, rollIndex) => {
                this.addDie(detail, rollIndex, rerollDetails.length);
            });

            return new Promise(resolve => {
                window.setTimeout(() => this.resolveWhenStopped(resolve), 500);
            });
        }

        addDie(detail, index, totalCount) {
            const dieType = getDieType(detail);
            const mesh = createD10(dieType);
            const body = createD10PhysicsBody();
            const dieIndex = detail.index ?? index;
            const angle = (index / totalCount) * Math.PI * 2;
            const radius = Math.min(4, Math.max(1.2, totalCount * 0.45));

            body.position.set(
                Math.cos(angle) * radius + (Math.random() - 0.5) * 1.5,
                7 + Math.random() * 3,
                Math.sin(angle) * radius + (Math.random() - 0.5) * 1.5,
            );
            body.quaternion.setFromEuler(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
            );
            body.velocity.set(
                (Math.random() - 0.5) * 10,
                -5,
                (Math.random() - 0.5) * 10,
            );
            body.angularVelocity.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
            );

            this.scene.add(mesh);
            this.world.addBody(body);
            this.dice.push({
                index: dieIndex,
                mesh,
                body,
                isHunger: dieType === 'blood',
                selected: false,
                selectable: false,
            });
            this.bodies.push(body);
        }

        removeDieByIndex(index) {
            const die = this.dice.find(item => item.index === index);
            if (!die) {
                return;
            }

            this.updateDieSelectionStyle({ ...die, selected: false });
            this.scene.remove(die.mesh);
            this.world.removeBody(die.body);
            this.dice = this.dice.filter(item => item !== die);
            this.bodies = this.bodies.filter(body => body !== die.body);
        }

        freezeDiceExcept(excludedIndexes) {
            const excluded = new Set(excludedIndexes);
            this.dice.forEach(die => {
                die.selected = false;
                this.updateDieSelectionStyle(die);

                if (excluded.has(die.index)) {
                    return;
                }

                die.body.velocity.set(0, 0, 0);
                die.body.angularVelocity.set(0, 0, 0);
                die.body.mass = 0;
                die.body.type = CANNON.Body.STATIC;
                die.body.updateMassProperties();
            });
        }

        setSelection(options = {}) {
            this.selection.enabled = Boolean(options.enabled);
            this.selection.max = options.max || 3;
            this.selection.selectedIndexes = new Set(options.selectedIndexes || []);
            this.selection.selectableIndexes = new Set(options.selectableIndexes || []);
            this.selection.onChange = options.onChange || null;
            this.renderer.domElement.style.cursor = this.selection.enabled ? 'pointer' : 'default';

            this.dice.forEach(die => {
                die.selectable = this.selection.enabled && this.selection.selectableIndexes.has(die.index);
                die.selected = die.selectable && this.selection.selectedIndexes.has(die.index);
                this.updateDieSelectionStyle(die);
            });
        }

        getSelectedIndexes() {
            return Array.from(this.selection.selectedIndexes);
        }

        handlePointerClick(event) {
            if (!this.selection.enabled || this.isRolling) {
                return;
            }

            const rect = this.renderer.domElement.getBoundingClientRect();
            this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            this.raycaster.setFromCamera(this.pointer, this.camera);

            const intersects = this.raycaster.intersectObjects(this.dice.map(die => die.mesh), true);
            if (!intersects.length) {
                return;
            }

            const die = this.findDieByObject(intersects[0].object);
            if (!die || !die.selectable) {
                return;
            }

            if (die.selected) {
                this.selection.selectedIndexes.delete(die.index);
            } else if (this.selection.selectedIndexes.size < this.selection.max) {
                this.selection.selectedIndexes.add(die.index);
            } else {
                return;
            }

            die.selected = this.selection.selectedIndexes.has(die.index);
            this.updateDieSelectionStyle(die);

            if (this.selection.onChange) {
                this.selection.onChange(this.getSelectedIndexes());
            }
        }

        findDieByObject(object) {
            let current = object;
            while (current) {
                const die = this.dice.find(item => item.mesh === current);
                if (die) {
                    return die;
                }
                current = current.parent;
            }

            return null;
        }

        updateDieSelectionStyle(die) {
            die.mesh.scale.setScalar(die.selected ? 1.08 : 1);
            die.mesh.traverse(child => {
                if (!child.material || !child.material.emissive) {
                    return;
                }

                child.material.emissive.set(die.selected ? 0x8b0000 : 0x000000);
                child.material.emissiveIntensity = die.selected ? 0.55 : 0;
            });
        }

        resolveWhenStopped(resolve, startedAt = Date.now()) {
            const threshold = 0.1;
            const maxRollTimeMs = 7000;
            const allStopped = this.bodies.every(body => {
                const v = body.velocity;
                const av = body.angularVelocity;
                const speed = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
                const angularSpeed = Math.sqrt(av.x * av.x + av.y * av.y + av.z * av.z);
                return speed <= threshold && angularSpeed <= threshold;
            });

            if (!allStopped && Date.now() - startedAt < maxRollTimeMs) {
                window.setTimeout(() => this.resolveWhenStopped(resolve, startedAt), 100);
                return;
            }

            this.isRolling = false;
            this.bodies.forEach(body => {
                body.velocity.set(0, 0, 0);
                body.angularVelocity.set(0, 0, 0);
            });

            resolve(this.getRolledDiceValues());
        }

        getRolledDiceValues() {
            return [...this.dice]
                .sort((left, right) => left.index - right.index)
                .map(({ body, isHunger }) => ({
                    raw_value: this.getTopFace(body),
                    is_hunger: isHunger,
                }));
        }

        getTopFace(body) {
            const upVector = new CANNON.Vec3(0, 1, 0);
            let maxDot = -Infinity;
            let topFaceIndex = 0;

            faceData.forEach((face, index) => {
                const tri = face.tris[0];
                const v0 = vertexes[tri[0]];
                const v1 = vertexes[tri[1]];
                const v2 = vertexes[tri[2]];
                const edge1 = new CANNON.Vec3(
                    (v1[0] - v0[0]) * DICE_SCALE,
                    (v1[1] - v0[1]) * DICE_SCALE,
                    (v1[2] - v0[2]) * DICE_SCALE,
                );
                const edge2 = new CANNON.Vec3(
                    (v2[0] - v0[0]) * DICE_SCALE,
                    (v2[1] - v0[1]) * DICE_SCALE,
                    (v2[2] - v0[2]) * DICE_SCALE,
                );
                const normal = new CANNON.Vec3();

                edge1.cross(edge2, normal);
                normal.normalize();

                const rotatedNormal = body.quaternion.vmult(normal);
                const dot = rotatedNormal.dot(upVector);
                if (dot > maxDot) {
                    maxDot = dot;
                    topFaceIndex = index;
                }
            });

            const value = parseInt(faceData[topFaceIndex].label, 10);
            return value === 0 ? 10 : value;
        }

        animate() {
            this.animationFrameId = window.requestAnimationFrame(() => this.animate());

            if (this.isRolling) {
                this.world.step(1 / 60);
            }

            this.dice.forEach(({ mesh, body }) => {
                mesh.position.copy(body.position);
                mesh.quaternion.copy(body.quaternion);
            });

            this.renderer.render(this.scene, this.camera);
        }
    }

    function getInstance(container) {
        let instance = instances.get(container);
        if (!instance) {
            instance = new DiceRoller3D(container);
            instances.set(container, instance);
        }

        return instance;
    }

    window.diceRoller3D = {
        roll(containerOrSelector, diceDetails) {
            const container = getContainer(containerOrSelector);
            if (!container || !ensureLibraries()) {
                return Promise.resolve();
            }

            return getInstance(container).roll(diceDetails);
        },

        rerollIndexes(containerOrSelector, indexes) {
            const container = getContainer(containerOrSelector);
            if (!container || !ensureLibraries()) {
                return Promise.resolve();
            }

            return getInstance(container).rerollIndexes(indexes);
        },

        clear(containerOrSelector) {
            const container = getContainer(containerOrSelector);
            const instance = container ? instances.get(container) : null;
            if (instance) {
                instance.clear();
            }
        },

        setSelection(containerOrSelector, options) {
            const container = getContainer(containerOrSelector);
            const instance = container ? instances.get(container) : null;
            if (instance) {
                instance.setSelection(options);
            }
        },

        getSelectedIndexes(containerOrSelector) {
            const container = getContainer(containerOrSelector);
            const instance = container ? instances.get(container) : null;
            return instance ? instance.getSelectedIndexes() : [];
        },

        getIconScale() {
            return DICE_ICON_FACE_SCALE;
        },
    };
})();
