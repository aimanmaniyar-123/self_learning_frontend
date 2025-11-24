"""
Main FastAPI Application
Self Learning & Self Improvement System
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Self Learning & Self Improvement System",
    description="AI Agent Management and Learning System",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== HEALTH CHECK ====================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "Self Learning & Self Improvement System",
        "version": "1.0.0"
    }

# ==================== IMPORT ROUTES ====================

# Import your route modules
try:
    # Import agent routes
    from routes import agents as agents_routes
    app.include_router(agents_routes.router, prefix="/api/agents", tags=["Agents"])
    logger.info("✅ Agents routes loaded")
except ImportError as e:
    logger.warning(f"⚠️ Agents routes not found: {e}")

try:
    # Import training routes
    from routes import training as training_routes
    app.include_router(training_routes.router, prefix="/api/training", tags=["Training"])
    logger.info("✅ Training routes loaded")
except ImportError as e:
    logger.warning(f"⚠️ Training routes not found: {e}")

try:
    # Import performance routes
    from routes import performance as performance_routes
    app.include_router(performance_routes.router, prefix="/api/performance", tags=["Performance"])
    logger.info("✅ Performance routes loaded")
except ImportError as e:
    logger.warning(f"⚠️ Performance routes not found: {e}")

try:
    # Import evolution routes
    from routes import evolution as evolution_routes
    app.include_router(evolution_routes.router, prefix="/api/evolution", tags=["Evolution"])
    logger.info("✅ Evolution routes loaded")
except ImportError as e:
    logger.warning(f"⚠️ Evolution routes not found: {e}")

try:
    # Import anomaly routes
    from routes import anomaly as anomaly_routes
    
    # Initialize anomaly detector
    try:
        from anomaly_detection import AnomalyDetector
        anomaly_routes.anomaly_detector = AnomalyDetector(
            baseline_window_size=100,
            anomaly_threshold_sigma=3.0
        )
        logger.info("✅ Anomaly detector initialized")
    except ImportError:
        logger.warning("⚠️ AnomalyDetector class not found")
    
    app.include_router(anomaly_routes.router, prefix="/api/anomaly", tags=["Anomaly Detection"])
    logger.info("✅ Anomaly routes loaded")
except ImportError as e:
    logger.warning(f"⚠️ Anomaly routes not found: {e}")

try:
    # Import goals routes
    from routes import goals as goals_routes
    
    # Initialize goal manager
    try:
        from goal_settings import GoalManager
        goals_routes.goal_manager = GoalManager()
        logger.info("✅ Goal manager initialized")
    except ImportError:
        logger.warning("⚠️ GoalManager class not found")
    
    app.include_router(goals_routes.router, prefix="/api/goals", tags=["Goals"])
    logger.info("✅ Goals routes loaded")
except ImportError as e:
    logger.warning(f"⚠️ Goals routes not found: {e}")

try:
    # Import checkpoint routes
    from routes import checkpoint as checkpoint_routes
    
    # Initialize checkpoint manager
    try:
        from checkpoint_rollback import CheckpointManager
        checkpoint_routes.checkpoint_manager = CheckpointManager()
        logger.info("✅ Checkpoint manager initialized")
    except ImportError:
        logger.warning("⚠️ CheckpointManager class not found")
    
    app.include_router(checkpoint_routes.router, prefix="/api/checkpoint", tags=["Checkpoints"])
    logger.info("✅ Checkpoint routes loaded")
except ImportError as e:
    logger.warning(f"⚠️ Checkpoint routes not found: {e}")

try:
    # Import multi-agent routes
    from routes import multi_agent as multi_agent_routes
    app.include_router(multi_agent_routes.router, prefix="/api/multi-agent", tags=["Multi-Agent"])
    logger.info("✅ Multi-agent routes loaded")
except ImportError as e:
    logger.warning(f"⚠️ Multi-agent routes not found: {e}")

try:
    # Import prompts routes
    from routes import prompts as prompts_routes
    app.include_router(prompts_routes.router, prefix="/api/prompts", tags=["Prompts"])
    logger.info("✅ Prompts routes loaded")
except ImportError as e:
    logger.warning(f"⚠️ Prompts routes not found: {e}")

try:
    # Import system routes
    from routes import system as system_routes
    app.include_router(system_routes.router, prefix="/api/system", tags=["System"])
    logger.info("✅ System routes loaded")
except ImportError as e:
    logger.warning(f"⚠️ System routes not found: {e}")

# ==================== STARTUP EVENT ====================

@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info("=" * 60)
    logger.info("🚀 Self Learning & Self Improvement System Starting...")
    logger.info("=" * 60)
    logger.info(f"📍 Server: http://127.0.0.1:8000")
    logger.info(f"📖 Docs: http://127.0.0.1:8000/docs")
    logger.info(f"🔧 Health: http://127.0.0.1:8000/health")
    logger.info("=" * 60)

@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    logger.info("🛑 Application shutting down...")

# ==================== DOCUMENTATION ====================

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "service": "Self Learning & Self Improvement System",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "agents": "/api/agents",
            "training": "/api/training",
            "performance": "/api/performance",
            "evolution": "/api/evolution",
            "anomaly": "/api/anomaly",
            "goals": "/api/goals",
            "checkpoint": "/api/checkpoint",
            "multi_agent": "/api/multi-agent",
            "prompts": "/api/prompts",
            "system": "/api/system"
        }
    }

# ==================== RUN APPLICATION ====================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
