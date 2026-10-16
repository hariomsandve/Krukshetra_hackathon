import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  AlertCircle,
  PlayCircle,
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';

export const ConceptGraphCanvas = ({
  graphData,
  selectedConceptId,
  onSelectConcept,
  onStartLearning
}) => {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const nodes = graphData?.nodes || [];
  const edges = graphData?.edges || [];

  // Calculate layout coordinates for DAG nodes
  const layout = useMemo(() => {
    if (!nodes.length) return { nodePositions: {}, width: 800, height: 500 };

    // Group nodes by tier_level
    const tierMap = {};
    nodes.forEach(n => {
      const tier = n.tier_level ?? 0;
      if (!tierMap[tier]) tierMap[tier] = [];
      tierMap[tier].push(n);
    });

    const tierKeys = Object.keys(tierMap).map(Number).sort((a, b) => a - b);
    const nodePositions = {};

    const TIER_SPACING_X = 280;
    const NODE_SPACING_Y = 130;
    const NODE_WIDTH = 200;
    const NODE_HEIGHT = 85;

    let maxNodesInTier = 1;
    tierKeys.forEach(t => {
      if (tierMap[t].length > maxNodesInTier) maxNodesInTier = tierMap[t].length;
    });

    const totalHeight = Math.max(500, maxNodesInTier * NODE_SPACING_Y + 120);

    tierKeys.forEach((tier, tierIdx) => {
      const tierNodes = tierMap[tier];
      const startX = 60 + tierIdx * TIER_SPACING_X;

      // Vertically center nodes in this tier
      const tierHeight = tierNodes.length * NODE_SPACING_Y;
      const startY = (totalHeight - tierHeight) / 2 + 30;

      tierNodes.forEach((node, idx) => {
        nodePositions[node.id] = {
          x: startX,
          y: startY + idx * NODE_SPACING_Y,
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          node
        };
      });
    });

    const totalWidth = Math.max(900, (tierKeys.length) * TIER_SPACING_X + 160);

    return {
      nodePositions,
      width: totalWidth,
      height: totalHeight
    };
  }, [nodes]);

  // Reset viewport
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 40, y: 40 });
  };

  // Zoom handlers
  const handleZoomIn = () => setZoom(prev => Math.min(2.0, prev + 0.15));
  const handleZoomOut = () => setZoom(prev => Math.max(0.4, prev - 0.15));

  // Fit to screen
  const handleFitToScreen = () => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const scaleX = (clientWidth - 80) / layout.width;
    const scaleY = (clientHeight - 80) / layout.height;
    const fitScale = Math.min(1.2, Math.max(0.5, Math.min(scaleX, scaleY)));
    setZoom(fitScale);
    setPan({
      x: (clientWidth - layout.width * fitScale) / 2,
      y: (clientHeight - layout.height * fitScale) / 2
    });
  };

  // Mouse pan handling
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Filter nodes based on search & difficulty
  const isNodeHighlighted = (node) => {
    if (searchQuery && !node.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (difficultyFilter !== 'all' && node.difficulty !== difficultyFilter) {
      return false;
    }
    return true;
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '620px',
        background: 'radial-gradient(circle at 50% 50%, #0d1527 0%, var(--bg-app) 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        userSelect: 'none'
      }}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Floating Controls Bar */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      >
        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search concepts in DAG..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '32px', fontSize: '0.75rem', height: '34px', background: 'rgba(11, 17, 30, 0.9)', backdropFilter: 'blur(8px)' }}
            />
          </div>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="form-select"
            style={{ width: '130px', fontSize: '0.75rem', height: '34px', background: 'rgba(11, 17, 30, 0.9)', backdropFilter: 'blur(8px)' }}
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Viewport Nav Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(11, 17, 30, 0.9)',
            backdropFilter: 'blur(8px)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            pointerEvents: 'auto'
          }}
        >
          <button onClick={handleZoomIn} className="btn btn-ghost" style={{ padding: '6px' }} title="Zoom in">
            <ZoomIn size={15} />
          </button>
          <button onClick={handleZoomOut} className="btn btn-ghost" style={{ padding: '6px' }} title="Zoom out">
            <ZoomOut size={15} />
          </button>
          <button onClick={handleFitToScreen} className="btn btn-ghost" style={{ padding: '6px' }} title="Fit graph to view">
            <Maximize2 size={15} />
          </button>
          <button onClick={handleReset} className="btn btn-ghost" style={{ padding: '6px' }} title="Reset zoom and position">
            <RotateCcw size={15} />
          </button>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', padding: '0 6px', borderLeft: '1px solid var(--border-subtle)' }}>
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        width="100%"
        height="100%"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <defs>
          {/* Arrow Marker definition */}
          <marker
            id="dag-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" opacity="0.8" />
          </marker>
          <marker
            id="dag-arrow-active"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#818cf8" />
          </marker>

          {/* Grid pattern */}
          <pattern id="canvas-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="rgba(148, 163, 184, 0.07)" />
          </pattern>
        </defs>

        {/* Background Grid */}
        <rect width="100%" height="100%" fill="url(#canvas-grid)" />

        {/* Transformable Canvas Group */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Directed Prerequisite Edges */}
          {edges.map((edge, idx) => {
            const src = layout.nodePositions[edge.source];
            const dst = layout.nodePositions[edge.target];
            if (!src || !dst) return null;

            const isRelatedToSelected =
              selectedConceptId === edge.source || selectedConceptId === edge.target;

            // Starting point on the right edge of prerequisite node
            const startX = src.x + src.width;
            const startY = src.y + src.height / 2;

            // End point on the left edge of dependent node
            const endX = dst.x;
            const endY = dst.y + dst.height / 2;

            // Smooth cubic Bezier curve
            const dx = Math.max(60, (endX - startX) / 2);
            const pathData = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;

            return (
              <g key={`edge-${idx}`}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={isRelatedToSelected ? '#818cf8' : 'rgba(99, 102, 241, 0.35)'}
                  strokeWidth={isRelatedToSelected ? 2.5 : 1.75}
                  strokeDasharray={isRelatedToSelected ? 'none' : '4 3'}
                  markerEnd={isRelatedToSelected ? 'url(#dag-arrow-active)' : 'url(#dag-arrow)'}
                  style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {Object.entries(layout.nodePositions).map(([nodeId, pos]) => {
            const { node } = pos;
            const isSelected = selectedConceptId === nodeId;
            const isMatch = isNodeHighlighted(node);

            // Node status & badge colors
            const status = node.status || 'available';
            const difficulty = node.difficulty || 'beginner';

            const statusColor =
              status === 'mastered'
                ? '#10b981'
                : status === 'in-progress'
                ? '#06b6d4'
                : status === 'weak'
                ? '#f59e0b'
                : status === 'locked'
                ? '#64748b'
                : '#6366f1';

            return (
              <g
                key={nodeId}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectConcept(node);
                }}
                style={{
                  cursor: 'pointer',
                  opacity: isMatch ? 1 : 0.25,
                  transition: 'opacity 0.2s, transform 0.15s'
                }}
              >
                {/* Node Box */}
                <rect
                  width={pos.width}
                  height={pos.height}
                  rx="8"
                  ry="8"
                  fill={isSelected ? '#18243c' : '#101827'}
                  stroke={isSelected ? '#818cf8' : isRelatedNode(node, selectedConceptId, edges) ? '#6366f1' : 'rgba(148, 163, 184, 0.15)'}
                  strokeWidth={isSelected ? 2 : 1}
                  style={{
                    filter: isSelected ? 'drop-shadow(0 4px 12px rgba(99, 102, 241, 0.4))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                  }}
                />

                {/* Left accent bar representing status */}
                <rect
                  x="0"
                  y="0"
                  width="4"
                  height={pos.height}
                  rx="2"
                  ry="2"
                  fill={statusColor}
                />

                {/* Difficulty & Status Icons */}
                <foreignObject x="12" y="8" width={pos.width - 20} height="20">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge badge-${difficulty}`} style={{ fontSize: '0.625rem', padding: '1px 5px' }}>
                      {difficulty}
                    </span>
                    <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={10} /> {node.estimated_minutes}m
                    </span>
                  </div>
                </foreignObject>

                {/* Title */}
                <text
                  x="14"
                  y="46"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                >
                  {truncateText(node.title, 24)}
                </text>

                {/* Prerequisite Count indicator */}
                <foreignObject x="12" y="56" width={pos.width - 24} height="22">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Tier {node.tier_level}
                    </span>
                    <span style={{ color: statusColor, fontWeight: 600, textTransform: 'capitalize' }}>
                      {status === 'mastered' ? 'Mastered ✓' : status === 'weak' ? 'Needs Review !' : status}
                    </span>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Bottom Floating Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          background: 'rgba(11, 17, 30, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 12px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          fontSize: '0.6875rem',
          color: 'var(--text-secondary)',
          pointerEvents: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
          <span>Mastered</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }} />
          <span>In Progress</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
          <span>Weak (Needs Review)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#64748b' }} />
          <span>Locked</span>
        </div>
      </div>
    </div>
  );
};

// Helper function to truncate strings
function truncateText(str, maxLen) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen - 1) + '…' : str;
}

// Helper to check if a node is an immediate prereq or dependent
function isRelatedNode(node, selectedId, edges) {
  if (!selectedId) return false;
  return edges.some(
    e => (e.source === selectedId && e.target === node.id) ||
         (e.target === selectedId && e.source === node.id)
  );
}
