<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'avatar',
        'last_login_at',
        'last_login_ip',
        'created_by',
        'updated_by',
    ];
    protected $keyType = 'string';
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }
    // Dans votre modèle User
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            $model->ref = Str::uuid();
        });
    }



    public function profile()
    {
        return $this->hasOne(Profil::class);
    }

  
    public function hospital()
    {
        return $this->hasOneThrough(
            Hopital::class,
            Profil::class,
            'user_id',
            'id',
            'id',
            'hopital_id'
        );
    }
    /**
     * Vérifie si l'utilisateur est un administrateur central
     *
     * @return bool
    */
    public function isAdminCentral(): bool
    {
        return $this->role === 'admin_central';
    }

    /**
     * Vérifie si l'utilisateur est un administrateur
     *
     * @return bool
    */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Vérifie si l'utilisateur est un personnel médical
     *
     * @return bool
    */
    public function isMedicalStaff(): bool
    {
        return in_array($this->role, ['medecin', 'pharmacien', 'magasinier']);
    }

    /**
     * Scope pour filtrer les utilisateurs par hôpital
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $hospitalId
     * @return \Illuminate\Database\Eloquent\Builder
    */
    public function scopeForHospital($query, $hospitalId)
    {
        return $query->whereHas('profile', function($q) use ($hospitalId) {
            $q->where('hopital_id', $hospitalId);
        });
    }

    /**
     * Vérifie si l'utilisateur a une permission spécifique
     *
     * @param string $module
     * @param string $action
     * @return bool
    */
    public function hasPermission(string $module, string $action): bool
    {
        return $this->permissions()
            ->where('module', $module)
            ->where('action', $action)
            ->exists();
}

    /**
     * Récupère les permissions de l'utilisateur
     *
     * @return \Illuminate\Database\Eloquent\Collection
    */
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'user_permissions')
            ->withTimestamps();
    }

    /**
     * Récupère l'utilisateur qui a créé le modèle
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
    */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Récupère l'utilisateur qui a mis à jour le modèle
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
    */
    public function updatedBy()
{
    return $this->belongsTo(User::class, 'updated_by');
}

public function grantedBy1()
{
    return $this->belongsTo(User::class, 'granted_by');
}




public function alerts()
{
    return $this->hasMany(Alert::class);
}

public function stockMouvements()
{
    return $this->hasMany(StockMouvement::class, 'created_by');
}

public function transfertsInities()
{
    return $this->hasMany(Transfert::class, 'created_by');
}

public function medicalProduits()
{
    return $this->hasMany(MedicalProduit::class, 'created_by');
}
public function profil()
{
    return $this->hasOne(Profil::class);
}

protected $appends = ['avatar_url'];

    /**
     * Accessor pour obtenir l'URL complète de l'avatar
     */
    public function getAvatarUrlAttribute()
{
    if ($this->avatar) {
        return asset(Storage::url($this->avatar));
    }
    return asset('images/default-avatar.png');
}

    /**
     * Mutator pour gérer l'upload de l'avatar
     */
    public function setAvatarAttribute($value)
{
    // Si c'est une instance de UploadedFile (fichier uploadé)
    if ($value instanceof \Illuminate\Http\UploadedFile) {
        $this->attributes['avatar'] = $value->store('avatars', 'public');
    } 
    // Si c'est une URL ou null
    else {
        $this->attributes['avatar'] = $value;
    }
}
}
