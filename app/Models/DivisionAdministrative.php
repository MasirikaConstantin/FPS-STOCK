<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class DivisionAdministrative extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;
    protected $table = 'division_administraves';
    protected $fillable = [
        'nom',
        'type',
        'code',
        'is_active',
        'parent_id',
        'created_by',

    ];
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            $model->ref = Str::uuid();
        });
    }

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeProvinces($query)
    {
        return $query->where('type', 'province');
    }

    public function scopeTerritoires($query)
    {
        return $query->where('type', 'territoire');
    }

    public function scopeVilles($query)
    {
        return $query->where('type', 'ville');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function getHierarchyAttribute(): string
    {
        $hierarchy = [$this->nom];
        $parent = $this->parent;

        while ($parent) {
            array_unshift($hierarchy, $parent->nom);
            $parent = $parent->parent;
        }

        return implode(' > ', $hierarchy);
    }
}
