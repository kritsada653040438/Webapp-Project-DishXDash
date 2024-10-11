import { useEffect, useRef } from 'react';

const Fireworks = () => {
  const canvasRef = useRef(null);
  const fireworksRef = useRef([]);
  const gravity = { x: 0, y: 0.02 }; // ลดแรงโน้มถ่วงลงเพื่อให้การเคลื่อนที่ช้าลง

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // ฟังก์ชันการตั้งค่าขนาด canvas
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize(); // ตั้งค่าขนาด canvas ครั้งแรก

    // ตั้งค่าขนาดใหม่เมื่อมีการเปลี่ยนแปลงขนาดหน้าต่าง
    window.addEventListener('resize', setCanvasSize);

    const createFirework = () => {
      if (Math.random() <= 0.1) { // เพิ่มความถี่ของพลุ
        const firework = new Firework(canvas.width, canvas.height, ctx, gravity);
        fireworksRef.current.push(firework);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      fireworksRef.current.forEach((firework, index) => {
        firework.update();
        firework.show();

        if (firework.isDone()) {
          fireworksRef.current.splice(index, 1);
        }
      });

      createFirework();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize); // ลบ event listener เมื่อ component ถูกทำลาย
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 z-50 bg-transparent pointer-events-none"></canvas>
  );
};

class Firework {
  constructor(width, height, ctx, gravity) {
    this.ctx = ctx;
    this.gravity = gravity;
    this.particles = [];
    this.exploded = false;
    this.firework = new Particle(Math.random() * width, height, Math.random() * 255, false);
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce(this.gravity);
      this.firework.update();

      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }

    this.particles = this.particles.filter(particle => !particle.isDone());
    this.particles.forEach(particle => {
      particle.applyForce(this.gravity);
      particle.update();
    });
  }

  explode() {
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
      const particle = new Particle(this.firework.pos.x, this.firework.pos.y, this.firework.hu, true);
      this.particles.push(particle);
    }
  }

  show() {
    if (!this.exploded) {
      this.firework.show(this.ctx);
    }

    this.particles.forEach(particle => {
      particle.show(this.ctx);
    });
  }

  isDone() {
    return this.exploded && this.particles.length === 0;
  }
}

class Particle {
  constructor(x, y, hu, isFirework) {
    this.pos = { x, y };
    this.hu = hu;
    this.isFirework = isFirework;
    this.lifespan = 255;
    this.vel = isFirework
  ? this.randomVelocity(1, 3) // อนุภาคที่แตกออกมา
  : { x: 0, y: -Math.random() * 10 - 1 }; // ลดความเร็วในแนวตั้งให้ต่ำลงอีก
    this.acc = { x: 0, y: 0 };
  }

  randomVelocity(min, max) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * (max - min) + min;
    return { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
  }

  applyForce(force) {
    this.acc.x += force.x;
    this.acc.y += force.y;
  }

  update() {
    if (this.isFirework) this.lifespan -= 2; // ลดการลดลงของ lifespan เพื่อให้หมดช้าลง
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  }

  show(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.isFirework ? 3 : 6, 0, Math.PI * 2); // ขนาดอนุภาคคงที่
    ctx.fillStyle = `hsla(${this.hu}, 100%, 50%, ${this.lifespan / 255})`;
    ctx.fill();
    ctx.restore();
  }

  isDone() {
    return this.lifespan <= 0;
  }
}

export default Fireworks;
