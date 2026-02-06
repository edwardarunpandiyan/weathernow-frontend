import "../../styles/skeleton loader/SkeletonLoader.css";

/* ──────────────────────────────────────────────
   City Info Skeleton
   ────────────────────────────────────────────── */
function CityInfoSkeleton() {
    return (
        <div className="skeleton-city">
            <div className="skeleton-city__row">
                <div className="skeleton-pulse skeleton-city__name" />
                <div className="skeleton-pulse skeleton-city__heart" />
            </div>
            <div className="skeleton-pulse skeleton-city__subtitle" />
        </div>
    );
}

/* ──────────────────────────────────────────────
   Day Cards Skeleton
   ────────────────────────────────────────────── */
function DayCardSkeleton() {
    return (
        <div className="skeleton-day-card">
            <div className="skeleton-pulse skeleton-day-card__name" />
            <div className="skeleton-pulse skeleton-day-card__icon" />
            <div className="skeleton-pulse skeleton-day-card__temp" />
        </div>
    );
}

function DayCardsSkeleton() {
    return (
        <div className="skeleton-days">
            <div className="skeleton-days__scroll">
                {Array.from({ length: 7 }).map((_, i) => (
                    <DayCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────
   Radial Skeleton
   ────────────────────────────────────────────── */
function RadialInfoSkeleton() {
    return (
        <div className="skeleton-radial">
            <div className="skeleton-pulse skeleton-radial__label" />

            <div className="skeleton-radial__circle">
                <div className="skeleton-radial__inner">
                    <div className="skeleton-pulse--glass skeleton-radial__time" />
                    <div className="skeleton-pulse--glass skeleton-radial__temp" />
                    <div className="skeleton-pulse--glass skeleton-radial__condition" />

                    <div className="skeleton-radial__details">
                        <div className="skeleton-pulse--glass-dim skeleton-radial__detail" />
                        <div className="skeleton-pulse--glass-dim skeleton-radial__detail" />
                        <div className="skeleton-pulse--glass-dim skeleton-radial__detail" />
                        <div className="skeleton-pulse--glass-dim skeleton-radial__detail" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────
   Hour Cards Skeleton
   ────────────────────────────────────────────── */
function HourCardSkeleton({ active }) {
    return (
        <div className={`skeleton-hour-card ${active ? "active" : ""}`}>
            <div className="skeleton-pulse skeleton-hour-card__badge" />
            <div className="skeleton-pulse skeleton-hour-card__time" />
            <div className="skeleton-pulse skeleton-hour-card__icon" />
            <div className="skeleton-pulse skeleton-hour-card__temp" />
        </div>
    );
}

function HourCardsSkeleton() {
    return (
        <div className="skeleton-hours">
            <div className="skeleton-hours__scroll">
                {Array.from({ length: 8 }).map((_, i) => (
                    <HourCardSkeleton key={i} active={i === 0} />
                ))}
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────
   Main Skeleton Loader
   ────────────────────────────────────────────── */
export default function WeatherSkeletonLoader() {
    return (
        <div className="skeleton-container">
            <CityInfoSkeleton />

            <div className="skeleton-main">
                <DayCardsSkeleton />
                <RadialInfoSkeleton />
                <HourCardsSkeleton />
            </div>
        </div>
    );
}
